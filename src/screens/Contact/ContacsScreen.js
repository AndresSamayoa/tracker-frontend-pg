import HttpPetition from "../../helpers/HttpPetition";
import ContactForm from "../../components/forms/contact/ContactForm";
import TableModal from "../../components/TableModal/TableModal";

import { useState } from "react";
import Modal from 'react-modal';

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function ContactScreen() {
  Modal.setAppElement('#root');

  const tableColumns = [
    {field: 'names', text: 'Nombre'},
    {field: 'phone', text: 'Telefono'},
    {field: 'email', text: 'Email'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setContactId(null)
    setNames("");
    setPhone("");
    setEmail("");
    setMessage('');
  };

  const saveForm = async () => {
    try {
      let url ;
      let method ;
      if (contactId > 0) {
        url = base_url + "/api/v1/contacts/" + contactId;
        method = 'PUT';
      } else {
        url = base_url + "/api/v1/contacts";
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
        errores.push("El telefono es un campo obligatorio.");
      }
      if (!email || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email.trim()))) {
        errores.push("El email debe tener un formato valido (xxx@xx.xx).");
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
          name: names.trim(),
          phone: phone.trim(),
          email: email,
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false)
        setMessage("Contacto guardado");
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

  const deleteItem = async (contact_id, searcher, setMensajeParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/contacts/'+contact_id,
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
      setMensajeParam('Error al eliminar el contacto: ' + error.message);
    }
  };

   const searchData = async (searcher, setMensajeParam) => {
      try {
        const response = await HttpPetition({
          url: base_url+'/api/v1/contacts/search/'+searcher,
          method: 'GET',
          validateStatus: () => true,
          timeout: 30000
        });

        if (response.status === 200) {
          const data = [];
          for (const contact of response.data) {
            data.push({
                names: contact.names,
                phone: contact.phone,
                email: contact.email,
                supervisor_names: contact.supervisor_names || 'N/A',
                actions: <div className='ActionContainer'>
                    <i 
                      onClick={()=>{
                        setContactId(contact.user_id)
                        setNames(contact.names)
                        setPhone(contact.phone)
                        setEmail(contact.email)
                        setIsTableModalOpen(false);
                      }} 
                      class="bi bi-pencil-square ActionItem"
                    ></i>
                    <i
                      onClick={()=>deleteItem(contact.contact_id, searcher, setMensajeParam)} 
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

  const cerrarModalTabla = () => {
    setIsTableModalOpen(false);
  };

  const [contactId, setContactId] = useState(0);
  const [names, setNames] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fetching, setFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Contactos</h1>
        <i class="bi bi-search openModal" onClick={()=> setIsTableModalOpen(true)}/>
      </div>
      <ContactForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setNames={setNames}
        setPhone={setPhone}
        setEmail={setEmail}
        names={names}
        phone={phone}
        email={email}
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

                placeHolder='Nombre o email de contacto.'
                tableColumns={tableColumns}
                tableData={tableData}
            />
        </Modal>
    </div>
  );
}
