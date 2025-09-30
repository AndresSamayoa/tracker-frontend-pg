import FormControl from "../../formControl/FormControl";

import { useState } from 'react';

export default function UserAverage({searchFn, cancelFn, message, fetching}) {

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const clear = () => {
    setStartDate('');
    setEndDate('');
    cancelFn();
  }

  const search = () => {
    searchFn(startDate, endDate);
  }

  return <div className='formGeneric'>
    <div className="formInputs">
      <FormControl type="date" label="Fecha de inicio" value={startDate} setValue={(e) => setStartDate(e.target.value)}/>
      <FormControl type="date" label="Fecha de fin" value={endDate} setValue={(e) => setEndDate(e.target.value)}/>
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
