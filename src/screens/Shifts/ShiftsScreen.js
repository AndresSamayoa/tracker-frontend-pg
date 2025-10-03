import HttpPetition from "../../helpers/HttpPetition";
import ShiftForm from "../../components/forms/shift/ShiftForm";
import TableModal from "../../components/TableModal/TableModal";

import { useState } from "react";
import Modal from 'react-modal';
import moment from "moment";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function ShiftsScreen() {

  const tableColumns = [
    {field: 'user_names', text: 'Usuario'},
    {field: 'start_date', text: 'Fecha de inicio'},
    {field: 'end_date', text: 'Fecha de fin'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setShiftId(0);
    setUser(null);
    setStartDate('');
    setEndDate('');
    setMessage('');
  };

  const saveForm = async () => {
    try {
      let url ;
      let method ;
      if (shiftId > 0) {
        url = base_url + "/api/v1/shifts/" + shiftId;
        method = 'PUT';
      } else {
        url = base_url + "/api/v1/shifts";
        method = 'POST';
      }
      if (fetching) {
        return
      }
      setFetching(true);
      const errores = [];

      if (!user) {
        errores.push("El usuario es un campo obligatorio.");
      }
      if (!startDate) {
        errores.push("La fecha y hora de inicio es necesaria.");
      } else if (!moment(startDate).isValid()) {
        errores.push("Debe ingresar una fecha y hora de inicio valida.");
      }
      if (!endDate) {
        errores.push("La fecha y hora de inicio es necesaria.");
      } else if (!moment(endDate).isValid()) {
        errores.push("Debe ingresar una fecha y hora de inicio valida.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMessage(mensajeError);
        setFetching(false);
        return;
      }

      const response = await HttpPetition({
        url: url,
        method: method,
        data: {
          user_id: user.value,
          start_time: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
          end_time: moment(endDate).format('YYYY-MM-DD hh:mm:ss')
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false)
        setMessage("Turno guardado");
      } else {
        setMessage(
          `No se pudo guardar, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al guardar: " + error.message);
      setFetching(false);
    }
  };

  const searchData = async (param, startTime, endTime , setMensajeParam) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/shifts/search/'+param,
        method: 'GET',
        params: {
          start_time: startTime,
          end_time: endTime
        },
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const data = [];
        for (const shift of response.data) {
          data.push({
              user_names: shift.user_names,
              start_date: moment(shift.start_date).format('DD-MM-YYYY hh:mm a'),
              end_date: shift.end_date ? moment(shift.end_date).format('DD-MM-YYYY hh:mm a') : 'N/A',
              actions: <div className='ActionContainer'>
                  <i 
                    onClick={()=>{
                      setShiftId(shift.shift_id);
                      setUser({label: shift.user_names, value: shift.user_id});
                      setStartDate(moment(shift.start_date).format('YYYY-MM-DDThh:mm'));
                      setEndDate(shift.end_date ? moment(shift.end_date).format('YYYY-MM-DDThh:mm') : '');
                      setIsTableModalOpen(false);
                    }} 
                    class="bi bi-pencil-square ActionItem"
                  ></i>
                  <i
                    onClick={()=>deleteItem(shift.shift_id, param, startTime, endTime, setMensajeParam)} 
                    style={{color:"red"}} 
                    class="bi bi-trash ActionItem"
                  ></i>
              </div>
          });
        }

        setTableData(data);
      } else if (response.status === 404) {
        setTableData([])
      } else {
        setMensajeParam(`Error al obtener los datos de la tabla, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensajeParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  }

  const deleteItem = async (shift_id, param, startTime, endTime , setMensajeParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/shifts/'+shift_id,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status === 200) {
        cancelForm();
        setMensajeParam('Exito al eliminar');
        searchData(param, startTime, endTime, setMensajeParam);
      } else {
        setMensajeParam(`'Error al eliminar, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensajeParam('Error al eliminar: ' + error.message);
    }
  }

  const searchUser = async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/users/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        console.log(response.data)
        const data = [];
        for (const user of response.data) {
          data.push({
            value: user.user_id,
            label: user.names,
          });
        }

        setFetching(false);
        return data;
      } else if (response.status === 404) {
        setFetching(false);
        return []
      } else {
        setMessage(`Error al obtener los datos de usuarios, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al buscar el usuario: " + error.message);
      setFetching(false);
      return []
    }
  };

  const cerrarModalTabla = () => {
    setIsTableModalOpen(false);
  };

  const [shiftId, setShiftId] = useState(0);
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
      <div className="genericScreen">
        <div className="titleContainer">
          <h1>Turnos</h1>
          <i class="bi bi-search openModal" onClick={()=> setIsTableModalOpen(true)}/>
        </div>
        <ShiftForm
          cancelarFn={cancelForm}
          guardarFn={saveForm}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setUser={setUser}
          searchUser={searchUser}
          startDate={startDate}
          endDate={endDate}
          user={user}
          fetching={fetching}
          message={message}
        />
  
        <Modal
              isOpen={isTableModalOpen}
              onRequestClose={cerrarModalTabla}
              shouldCloseOnEsc={true}
              shouldCloseOnOverlayClick={true}
          >
              <TableModal
                  closeModal={() => setIsTableModalOpen(false)}

                  useDateRange={true}
  
                  setTableData={setTableData}
                  searchData={searchData}
  
                  placeHolder='Nombre o email de usuario.'
                  tableColumns={tableColumns}
                  tableData={tableData}
              />
          </Modal>
      </div>
    );
}
