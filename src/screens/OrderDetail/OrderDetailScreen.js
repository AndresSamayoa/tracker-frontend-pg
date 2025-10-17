import HttpPetition from "../../helpers/HttpPetition";
import DataTable from "../../components/DataTable/DataTable";
import FormControl from "../../components/formControl/FormControl";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from 'react-modal';
import moment from "moment";
import StepGuide from "../../components/StepsGuide/StepsGuide";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function OrderDetailScreen() {
  const {orderId} = useParams();

  const tableColumns = [
    {field: 'step_name', text: 'Paso'},
    {field: 'coments', text: 'Comentarios'},
    {field: 'user', text: 'Encargado'},
    {field: 'date', text: 'Fecha'},
    {field: 'actions', text: 'Acciones'}
  ];

  const contactTableColumns = [
    {field: 'names', text: 'Nombres'},
    {field: 'email', text: 'Email'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setStepId(0);
    setStep(null);
    setDelay(null);
    setComment('');
    setMessage('');
  };

  const saveForm = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      let url ;
      let method ;
      let body ;
      const errores = [];
      if (stepId > 0) {
        url = base_url + "/api/v1/orders/"+orderId+"/step/" + stepId
        method = 'PUT';
        body = {comment: comment};
      } else if (step) {
        url = base_url + "/api/v1/orders/"+orderId+"/step";
        method = 'POST';
        body = {comment: comment, step_id: step.value};
      } else if (delay) {
        url = base_url + "/api/v1/orders/"+orderId+"/delay";
        method = 'POST';
        body = {comment: comment, delay_id: delay.value};
      } else {
        errores.push('Debe seleccionar un paso o atraso.');
      }

      if (!comment || comment.trim().length < 1) {
        errores.push("El comentario es un campo obligatorio.");
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
        data: body,
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        getOrder();
        setFetching(false);
        setMessage("Cambio guardado");
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

  const deleteDelay = async (delay_id) => {
    try {
      if (fetching) return;
      setFetching(true);
      const response = await HttpPetition({
        url: base_url + '/api/v1/orders/'+orderId+'/delay/'+delay_id,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status === 200) {
        cancelForm();
        getOrder();
        setFetching(false);
        setMessage('Exito al eliminar');
      } else {
        setFetching(false);
        setMessage(`'Error al eliminar, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setFetching(false);
      setMessage('Error al eliminar la cita: ' + error.message);
    }
  };

  const reverseStep = async () => {
    try {
      if (fetching) return;
      setFetching(true);
      const response = await HttpPetition({
        url: base_url + '/api/v1/orders/reverse/'+orderId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status === 200) {
        cancelForm();
        getOrder();
        setFetching(false);
        setMessage('Exito al eliminar');
      } else {
        setFetching(false);
        setMessage(`'Error al eliminar, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
        setFetching(false);
      setMessage('Error al eliminar la cita: ' + error.message);
    }
  };

  const searchContacts = async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/contacts/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const data = [];
        for (const contact of response.data) {
          data.push({
            value: contact.contact_id,
            label: contact.names
          });
        }

        setFetching(false);
        return data;
      } else if (response.status === 404) {
        setFetching(false);
        return []
      } else {
        setMessage(`Error al obtener los datos de contactos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al buscar el contacto: " + error.message);
      setFetching(false);
      return []
    }
  };

  const deleteContact = async (contact_id) => {
    try {
      if (fetching) return;
      setFetching(true);
      const response = await HttpPetition({
        url: base_url+'/api/v1/orders/'+orderId+'/contact/'+contact_id,
        method: 'DELETE',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        setFetching(false);
        setMessage(`Exito al desasignar al contacto`);
        getOrder();
      } else {
        setMessage(`Error al desasignar al contacto, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al desasignar al contacto: " + error.message);
      setFetching(false);
    }
  };

  const addContact = async () => {
    try {
      if (!contact) return ;
      if (fetching) return;
      setFetching(true);

      const response = await HttpPetition({
        url: base_url+'/api/v1/orders/'+orderId+'/contact',
        method: 'POST',
        data: {
          contact_id: contact.value
        },
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        setContact(null);
        setMessage(`Exito al asignar al contacto`);
        setFetching(false);
        getOrder();
      } else {
        setMessage(`Error al asignar al contacto, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al asignar al contacto: " + error.message);
      setFetching(false);
      return []
    }
  };

  const searchDelay = async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/delays/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const data = [];
        for (const delay of response.data) {
          data.push({
            value: delay.delay_id,
            label: delay.name,
          });
        }

        setFetching(false);
        return data;
      } else if (response.status === 404) {
        setFetching(false);
        return []
      } else {
        setMessage(`Error al obtener los datos de atrasos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al buscar el atraso: " + error.message);
      setFetching(false);
      return []
    }
  };

  const getNextSteps = async (step_id) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/workflow_steps/following/'+step_id,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const data = [];
        for (const nStep of response.data) {
          data.push({
            value: nStep.workflow_step_id,
            label: nStep.name,
          });
        }
        setFetching(false);
        setNextSteps(data);
      } else if (response.status === 404) {
        setFetching(false);
        setNextSteps([])
      } else {
        setMessage(`Error al obtener los datos de contactos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al buscar el contacto: " + error.message);
      setFetching(false);
      return []
    }
  };

  const getOrder = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/orders/${orderId}`,
        method: "GET",
      });

      if (response.status === 200) {
        let lastStepId = 0;
        const stepsTemp = [];
        const contactsTemp = [];

        for (const step of response.data.steps) {
          if (step.step_id > 0 && !lastStepId) lastStepId = step.step_id;
          stepsTemp.push({
            id: step.order_step,
            step_id: step.step_id,
            delay_id: step.delay_id,
            step_name: step.step_name,
            starting_step: step.starting_step,
            coments: step.comment,
            user: step.user_name,
            date: moment(step.date).format('DD-MM-YYYY'),
            actions: <div className='ActionContainer'>
                    <i
                      class="bi bi-pencil-square ActionItem"
                      onClick={()=>{
                        setStepId(step.order_step);
                        setComment(step.comment);
                      }}
                    ></i>
                    {step.delay_id > 0 && <i
                      onClick={()=>deleteDelay(step.order_step)} 
                      style={{color:"red"}} 
                      class="bi bi-trash ActionItem"
                    ></i>}
                </div>,
          });
        }

        for (const contact of response.data.contacts || []) {
          contactsTemp.push({
            names: contact.names,
            email: contact.email,
            actions: <div className='ActionContainer'>
                    <i
                      onClick={()=>deleteContact(contact.order_contact)} 
                      style={{color:"red"}} 
                      class="bi bi-trash ActionItem"
                    ></i>
                </div>
          });
        }

        setUser({id: response.data.user_id, names: response.data.user_names});
        setOrder({id: response.data.order_id, comment: response.data.comment});
        setWorkflowId(response.data.workflow_id)
        setLastStep(stepsTemp[0]);
        setOrderSteps(stepsTemp);
        setOrderContacts(contactsTemp);
        setFetching(false);
        getNextSteps(lastStepId)
      } else {
        console.log(response.data)
        setFetching(false);
      }
    } catch (error) {
      console.log("Error al consultar la orden: " + error.message);
      setFetching(false);
    }
  };

  const cerrarModalTabla = () => {
    setIsTableModalOpen(false);
  };

  const cerrarModalGuia = () => {
    setIsGuideModalOpen(false);
  };

  const [workflowId, setWorkflowId] = useState(0);
  const [stepId, setStepId] = useState(0);
  const [comment, setComment] = useState('');
  const [delay, setDelay] = useState(null);
  const [step, setStep] = useState(null);
  const [contact, setContact] = useState(null);
  const [lastStep, setLastStep] = useState({});
  const [user, setUser] = useState({});
  const [order, setOrder] = useState({});
  const [orderSteps, setOrderSteps] = useState([]);
  const [nextSteps, setNextSteps] = useState([])
  const [orderContacts, setOrderContacts] = useState([])
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  useEffect(()=>{getOrder()}, []);

  return (
    <div className="genericScreen">
      <div className="detailOrderContainer">
        <div className="titleContainer">
          <h1>Detalle de orden {orderId}</h1>
        <i class="bi bi-envelope openModal" onClick={()=> setIsTableModalOpen(true)}/>
        <i class="bi bi-patch-question openModal" onClick={()=> setIsGuideModalOpen(true)}/>
        </div>
        <div className="titleContainer">
          <div>
          <h2>Responable: {user.names}</h2>
          <h2>Paso actual: {lastStep.step_name} {!lastStep.starting_step && !(lastStep.delay_id > 0) && <i
                        onClick={()=>reverseStep()} 
                        style={{color:"red"}} 
                        class="bi bi-skip-backward ActionItem"
                      ></i>}
          </h2>
          <p>{order.comment}</p>
          </div>
        </div>
        {!(stepId > 0) && <FormControl type="searcher" label="Paso siguiente" value={step} setValue={(e)=>{setDelay(null); setStep(e)}} options={nextSteps} />}
        {!(stepId > 0) && <FormControl type="async-searcher" label="Atraso" value={delay} setValue={(e)=>{setDelay(e); setStep(null)}} selectSearcher={searchDelay} />}
        <FormControl type="textArea" label="Comentarios" value={comment} setValue={(e)=>{setComment(e.target.value)}} />
        <div className='formMessageContainer'>
          <p>{message}</p>
          {
              fetching && <div className="formLoaderContainer">
                  <p>Cargando&#8230;</p>
                  <span className="formLoader"><i className="bi bi-arrow-repeat"></i></span>
              </div>
          }
        </div>
        <div className="formControlsOptions">
            <button className="saveBtn" disabled={fetching} onClick={saveForm}><i className="bi bi-box-arrow-in-right"></i></button>
            <button className="cancelBtn" disabled={fetching} onClick={cancelForm}><i class="bi bi-x-lg"></i></button>
        </div>
        <DataTable 
          headers={tableColumns}
          rows={orderSteps}
        />
      </div>
      <Modal
          isOpen={isTableModalOpen}
          onRequestClose={cerrarModalTabla}
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
      >
        <div className="TableModalComponent">
          <div className='closeModalDiv'>
              <i onClick={cerrarModalTabla} class="bi bi-x closeIcon" />
          </div>
          <div className="inputSearcherSecundaryContainer">
            <FormControl type="async-searcher" label="Contacto" value={contact} setValue={setContact} selectSearcher={searchContacts} />
            <button className="saveBtn" disabled={fetching} onClick={addContact}><i className="bi bi-plus-circle"></i></button>
          </div>
          <div className='formMessageContainer'>
            <p>{message}</p>
            {
                fetching && <div className="formLoaderContainer">
                    <p>Cargando&#8230;</p>
                    <span className="formLoader"><i className="bi bi-arrow-repeat"></i></span>
                </div>
            }
          </div>
          <DataTable 
            headers={contactTableColumns}
            rows={orderContacts}
          />
        </div>
      </Modal>
      <Modal
          isOpen={isGuideModalOpen}
          onRequestClose={cerrarModalGuia}
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
      >
        <div className="TableModalComponent">
          <div className='closeModalDiv'>
              <i onClick={cerrarModalGuia} class="bi bi-x closeIcon" />
          </div>
          <h1>Pasos del flujo</h1>
          <StepGuide
            workflowId={workflowId}
          />
        </div>
      </Modal>
    </div>
  );
}
