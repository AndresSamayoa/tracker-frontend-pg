import HttpPetition from "../../helpers/HttpPetition";
import DelayForm from "../../components/forms/delay/DelayForm";
import TableModal from "../../components/TableModal/TableModal";

import { useState } from "react";
import Modal from 'react-modal';

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function UserScreen() {
  Modal.setAppElement('#root');

  const tableColumns = [
    {field: 'names', text: 'Nombre'},
    {field: 'text_active', text: 'Activo'},
    {field: 'text_error', text: 'Es error'},
    {field: 'text_notify', text: 'Notifica'},
    {field: 'supervisor_names', text: 'Supervisor'},
    {field: 'description', text: 'Descripcion'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setDelayId(0);
    setName("");
    setDescription("");
    setActive(true);
    setError(false);
    setNotify(false);
    setUser(null);
    setMessage('');
  };

  const saveForm = async () => {
    try {
      let url ;
      let method ;
      if (delayId > 0) {
        url = base_url + "/api/v1/delays/" + delayId;
        method = 'PUT';
      } else {
        url = base_url + "/api/v1/delays";
        method = 'POST';
      }
      if (fetching) {
        return
      }
      setFetching(true);
      const errores = [];

      if (!name || name.trim().length < 1) {
        errores.push("El nombre es un campo obligatorio.");
      }
      if (typeof active != 'boolean') {
        errores.push("Debe seleccionar si el atraso esta activo.");
      }
      if (typeof error != 'boolean') {
        errores.push("Debe seleccionar si el atraso es un error.");
      }
      if (typeof notify != 'boolean') {
        errores.push("Debe seleccionar si el atraso debe notificarse.");
      }
      if(!user) {
        errores.push("Debe seleccionar a un supervisor del atraso.");
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
          name: name.trim(),
          description: description,
          active: active,
          error: error,
          notify: notify,
          user_id: user.value
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false)
        setMessage("Atraso guardado");
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

  const deleteItem = async (delay_id, searcher, setMensajeParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/delays/'+delay_id,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status === 200) {
        cancelForm();
        setMensajeParam('Exito al eliminar');
        searchData(searcher, setMensajeParam);
      } else {
        setMensajeParam(`'Error al eliminar, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensajeParam('Error al eliminar la cita: ' + error.message);
    }
  };

   const searchData = async (searcher, setMensajeParam) => {
      try {
        const response = await HttpPetition({
          url: base_url+'/api/v1/delays/search/'+searcher,
          method: 'GET',
          validateStatus: () => true,
          timeout: 30000
        });

        if (response.status === 200) {
          const data = [];
          for (const delay of response.data) {
            data.push({
                names: delay.name,
                text_active: delay.active ? 'Si' : 'No',
                text_error: delay.error ? 'Si' : 'No',
                text_notify: delay.notify ? 'Si' : 'No',
                supervisor_names: delay.supervisor_names,
                description: delay.description,
                actions: <div className='ActionContainer'>
                    <i 
                      onClick={()=>{
                        setDelayId(delay.delay_id)
                        setName(delay.name)
                        setDescription(delay.description)
                        setActive(delay.active)
                        setError(delay.notify)
                        setNotify(delay.error)
                        setUser(delay.supervisor_id > 0 ? {value: delay.supervisor_id, label: delay.supervisor_names} : null)
                        setIsTableModalOpen(false);
                      }} 
                      class="bi bi-pencil-square ActionItem"
                    ></i>
                    <i
                      onClick={()=>deleteItem(delay.delay_id, searcher, setMensajeParam)} 
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

  const [delayId, setDelayId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState(false);
  const [notify, setNotify] = useState(false);
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Atrasos</h1>
        <i class="bi bi-search openModal" onClick={()=> setIsTableModalOpen(true)}/>
      </div>
      <DelayForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setName={setName}
        setDescription={setDescription}
        setActive={setActive}
        setError={setError}
        setNotify={setNotify}
        setSupervisor={setUser}
        searchSupervisor={searchUser}
        name={name}
        description={description}
        active={active}
        error={error}
        notify={notify}
        supervisor={user}
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
