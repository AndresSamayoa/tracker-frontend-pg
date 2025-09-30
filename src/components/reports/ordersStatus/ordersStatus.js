import FormControl from "../../formControl/FormControl";

import { useState } from 'react';

export default function OrderStatus({searchFn, cancelFn, message, fetching}) {

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contact, setContact] = useState('');
  const [user, setUser] = useState('');
  const [completed, setCompleted] = useState(false);

  const clear = () => {
    setStartDate('');
    setEndDate('');
    setContact('');
    setUser('');
    setCompleted(false);
    cancelFn();
  }

  const search = () => {
    searchFn(startDate, endDate, user, contact, completed);
  }

  return <div className='formGeneric'>
    <div className="formInputs">
      <FormControl type="date" label="Fecha de inicio" value={startDate} setValue={(e) => setStartDate(e.target.value)}/>
      <FormControl type="date" label="Fecha de fin" value={endDate} setValue={(e) => setEndDate(e.target.value)}/>
      <FormControl type="text" label="Usuario" value={user} setValue={(e) => setUser(e.target.value)}/>
      <FormControl type="text" label="Contacto" value={contact} setValue={(e) => setContact(e.target.value)}/>
      <FormControl type="checkbox" label="Completos" value={completed} setValue={(e) => setCompleted(e.target.checked)}/>
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
    <div className="formControlsOptions">
      <button className="saveBtn" disabled={fetching} onClick={search}><i className="bi bi-search"></i></button>
      <button className="cancelBtn" disabled={fetching} onClick={clear}><i class="bi bi-x-lg"></i></button>
    </div>
  </div>
}
