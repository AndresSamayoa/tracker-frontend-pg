import HttpPetition from "../../helpers/HttpPetition";
import UserForm from "../../components/forms/user/UserForm";
import TableModal from "../../components/TableModal/TableModal";

import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-modal';

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function UserScreen() {
  Modal.setAppElement('#root');

  const tableColumns = [
    {field: 'names', text: 'Nombre del flujo'},
    {field: 'text_active', text: 'Activo'},
    {field: 'phone', text: 'Telefono'},
    {field: 'email', text: 'Email'},
    {field: 'supervisor_names', text: 'Supervisor'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setUserId(null)
    setNames("");
    setPhone("");
    setEmail("");
    setPassword("");
    setActive(false);
    setAdmin(false);
    setUser(null);
    setMessage('');
  };

  const saveForm = async () => {
    try {
      let url ;
      let method ;
      if (userId > 0) {
        url = base_url + "/api/v1/users/" + userId;
        method = 'PUT';
      } else {
        url = base_url + "/api/v1/users";
        method = 'POST';
      }
      if (fetching) {
        return
      }
      setFetching(true);
      const errores = [];

      if (!names || names.trim().length < 1) {
        errores.push("El nombre es un campo obligatorio.");
      }
      if (!phone || phone.trim().length < 1) {
        errores.push("La descripcion es un campo obligatorio.");
      }
      if (!email || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email.trim()))) {
        errores.push("El email debe tener un formato valido (xxx@xx.xx).");
      }
      if (userId < 1 && (!password || password.length <= 7)) {
        errores.push("La clave debe de tener al menos 8 caracteres.");
      }
      if (typeof active != 'boolean') {
        errores.push("Debe seleccionar si el usuario esta activo.");
      }
      if (typeof admin != 'boolean') {
        errores.push("Debe seleccionar si el usuario es administrador.");
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
          names: names.trim(),
          phone: phone,
          email: email,
          password: password || null,
          active: active,
          admin: admin,
          user_id: user ? user.value : null
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false)
        setMessage("Usuario guardado");
      } else {
        setMessage(
          `No se pudo iniciar guardar, codigo: ${response.status}${
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

  const deleteItem = async (user_id, searcher, setMensajeParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/users/'+user_id,
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
          url: base_url+'/api/v1/users/search/'+searcher,
          method: 'GET',
          validateStatus: () => true,
          timeout: 30000
        });

        if (response.status === 200) {
          const data = [];
          for (const userData of response.data) {
            data.push({
                names: userData.names,
                text_active: userData.active ? 'Si' : 'No',
                phone: userData.phone,
                email: userData.email,
                supervisor_names: userData.supervisor_names || 'N/A',
                actions: <div className='ActionContainer'>
                    <i 
                      onClick={()=>{
                        setUserId(userData.user_id)
                        setNames(userData.names)
                        setPhone(userData.phone)
                        setEmail(userData.email)
                        setActive(userData.active)
                        setPassword('')
                        setAdmin(userData.admin)
                        setUser(userData.supervisor_id > 0 ? {value: userData.supervisor_id, label: userData.supervisor_names} : null)
                        setIsTableModalOpen(false);
                      }} 
                      class="bi bi-pencil-square ActionItem"
                    ></i>
                    <i
                      onClick={()=>deleteItem(userData.user_id, searcher, setMensajeParam)} 
                      style={{color:"red"}} 
                      class="bi bi-trash ActionItem"
                    ></i>
                    <Link to={'/permissions/crud/'+userData.user_id}> <i
                      style={{color:"blue"}} 
                      class="bi bi-eye ActionItem"
                    ></i> </Link>
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

  const [userId, setUserId] = useState(0);
  const [names, setNames] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Usuarios</h1>
        <i class="bi bi-search openModal" onClick={()=> setIsTableModalOpen(true)}/>
      </div>
      <UserForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setNames={setNames}
        setPhone={setPhone}
        setEmail={setEmail}
        setPassword={setPassword}
        setActive={setActive}
        setAdmin={setAdmin}
        setSupervisor={setUser}
        searchSupervisor={searchUser}
        names={names}
        phone={phone}
        email={email}
        password={password}
        active={active}
        admin={admin}
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
