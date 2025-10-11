import HttpPetition from "../../helpers/HttpPetition";
import WorkflowForm from "../../components/forms/workflow/WorkflowForm";
import TableModal from "../../components/TableModal/TableModal";

import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-modal';

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function WorkflowScreen() {
  Modal.setAppElement('#root');

  const tableColumns = [
    {field: 'name', text: 'Nombre del flujo'},
    {field: 'text_active', text: 'Activo'},
    {field: 'description', text: 'Descripcion'},
    {field: 'supervisor_name', text: 'Supervisor'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setWorkflowId(null)
    setName("");
    setDescription("");
    setActive(false);
    setUser(null);
    setMessage('');
  };

  const saveForm = async () => {
    try {
      let url ;
      let method ;
      if (workflowId > 0) {
        url = base_url + "/api/v1/workflows/" + workflowId;
        method = 'PUT';
      } else {
        url = base_url + "/api/v1/workflows";
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
      if (!description || description.trim().length < 1) {
        errores.push("La descripcion es un campo obligatorio.");
      }
      if (typeof active != 'boolean') {
        errores.push("Debe seleccionar si el flujo esta activo.");
      }
      if (!user || !user.value) {
        errores.push("Debe seleccionar un supervisor.");
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
          active: active,
          description: description.trim(),
          user_id: user.value
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false)
        setMessage("Flujo guardado");
      } else {
        setMessage(
          `No se pudo iniciar sesión, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al iniciar sesión: " + error.message);
      setFetching(false);
    }
  };

  const deleteItem = async (workflow, searcher, setMensajeParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/workflows/'+workflow,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
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
          url: base_url+'/api/v1/workflows/search/'+searcher,
          method: 'GET',
          validateStatus: () => true,
          timeout: 30000
        });

        if (response.status == 200) {
          const data = [];
          for (const workflow of response.data) {
            data.push({
                name: workflow.name,
                text_active: workflow.active ? 'Si' : 'No',
                description: workflow.description,
                supervisor_name: workflow.supervisor_name,
                actions: <div className='ActionContainer'>
                    <i 
                      onClick={()=>{
                        setWorkflowId(workflow.workflow_id)
                        setName(workflow.name)
                        setDescription(workflow.description)
                        setActive(workflow.active)
                        setUser({value: workflow.supervisor_id, label: workflow.supervisor_name})
                        setIsTableModalOpen(false);
                      }} 
                      class="bi bi-pencil-square ActionItem"
                    ></i>
                    <i
                      onClick={()=>deleteItem(workflow.workflow_id, searcher, setMensajeParam)} 
                      style={{color:"red"}} 
                      class="bi bi-trash ActionItem"
                    ></i>
                    <Link to={'/workflow_steps/crud/'+workflow.workflow_id}> <i
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

      if (response.status == 200) {
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
      } else if (response.status == 404) {
        setFetching(false);
        return []
      } else {
        setMessage(`Error al obtener los datos de usuarios, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al buscar el usuario: " + error.message);
      setFetching(false);
    }
  };

  const cerrarModalTabla = () => {
    setIsTableModalOpen(false);
  };

  const [workflowId, setWorkflowId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Flujos de trabajo</h1>
        <i class="bi bi-search openModal" onClick={()=> setIsTableModalOpen(true)}/>
      </div>
      <WorkflowForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setName={setName}
        setDescription={setDescription}
        setActive={setActive}
        setSupervisor={setUser}
        searchSupervisor={searchUser}
        name={name}
        description={description}
        active={active}
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

                placeHolder='Nombre del flujo'
                tableColumns={tableColumns}
                tableData={tableData}
            />
        </Modal>
    </div>
  );
}
