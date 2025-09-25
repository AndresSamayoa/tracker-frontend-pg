import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";
import OrderCrudForm from "../../components/forms/orderCrud/OrderCrudForm.js";

import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-modal';

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function OrdersCrudScreen() {
  const tableColumns = [
    {field: 'id', text: 'Codigo'},
    {field: 'coments', text: 'Comentarios'},
    {field: 'user', text: 'Encargado'},
    {field: 'workflow', text: 'Flujo'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setComment('');
    setWorkflow(null);
    setContact(null);
    setContactDel(null);
    setContacts([]);
    setMessage('');
  };

  const saveForm = async () => {
    try {
      let url ;
      let method ;
      url = base_url + "/api/v1/orders";
      method = 'POST';
      if (fetching) {
        return
      }
      setFetching(true);
      const errores = [];

      if (!comment || comment.trim().length < 1) {
        errores.push("El comentario es un campo obligatorio.");
      }
      if (!workflow) {
        errores.push("El flujo es un campo obligatorio.");
      }
      if (contacts.length < 1) {
        errores.push("Debe seleccionar al menos un contacto.");
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
          workflow_id: workflow.value,
          user_id: localStorage.getItem('userId'),
          comment: comment.trim(),
          contacts: contacts.map(c => c.value),
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false);
        setMessage("Orden guardada");
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

  const unselectContact = () => {
    if (!contactDel) return ;
    const data = [];
    for (const contact of contacts) {
      if(contact.value !== contactDel.value) data.push(contact);
    }
    setContacts(data);
    setContactDel(null);
  }

  const selectContact = () => {
    if(contact === null) return;
    if(contacts.findIndex(s => s.value === contact.value) > 0) {
      setContact(null);
      return;
    }

    contacts.push(contact);

    setContacts(contacts);
    setContact(null);
  }

  const deleteItem = async (order_id, param, setMensajeParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/orders/'+order_id,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status === 200) {
        cancelForm();
        setMensajeParam('Exito al eliminar');
        searchData(param, setMensajeParam);
      } else {
        setMensajeParam(`'Error al eliminar, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensajeParam('Error al eliminar la cita: ' + error.message);
    }
  };

  const searchData = async (searcher, paramType, setMensajeParam) => {
      try {
        const pending = paramType ? paramType.value : 0;
        const response = await HttpPetition({
          url: base_url+'/api/v1/orders/status/'+pending+'/search/'+searcher,
          method: 'GET',
          validateStatus: () => true,
          timeout: 30000
        });

        if (response.status === 200) {
          const data = [];
          for (const orderData of response.data) {
            data.push({
                id: orderData.order_id,
                coments: orderData.comment,
                user: orderData.user_names,
                workflow: orderData.workflow_name,
                actions: <div className='ActionContainer'>
                    <Link to={'/order/'+orderData.order_id+'/detail/'}> <i
                      class="bi bi-pencil-square ActionItem"
                    ></i></Link>
                    <i
                      onClick={()=>deleteItem(orderData.order_id, searcher, setMensajeParam)} 
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

  const searchWorkflow = async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/workflows/search/'+param,
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const data = [];
        for (const workflow of response.data) {
          data.push({
            value: workflow.workflow_id,
            label: workflow.name,
          });
        }

        setFetching(false);
        return data;
      } else if (response.status === 404) {
        setFetching(false);
        return []
      } else {
        setMessage(`Error al obtener los datos de flujos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al buscar el flujo: " + error.message);
      setFetching(false);
      return []
    }
  };

  const searchContact = async (param) => {
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
            label: contact.names,
            names: contact.names,
            email: contact.email,
            phone: contact.phone,
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

  const cerrarModalTabla = () => {
    setIsTableModalOpen(false);
  };

  const [comment, setComment] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [contact, setContact] = useState(null);
  const [contactDel, setContactDel] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Ordenes</h1>
        <i class="bi bi-search openModal" onClick={()=> setIsTableModalOpen(true)}/>
      </div>
      <OrderCrudForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setComment={setComment}
        setWorkflow={setWorkflow}
        setContact={setContact}
        setContactDel={setContactDel}
        addContact={selectContact}
        removeContact={unselectContact}
        searchWorkflow={searchWorkflow}
        searchContact={searchContact}
        comment={comment}
        workflow={workflow}
        contact={contact}
        contactDel={contactDel}
        contacts={contacts}
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

              useType={true}

              typeLabel="Estado de la orden"
              types={[{label: 'Completas', value: 0}, {label: 'Pendientes', value: 1}]}

              placeHolder='Nombre o email de usuario.'
              tableColumns={tableColumns}
              tableData={tableData}
          />
      </Modal>
    </div>
  );
}
