import DataTable from "../../DataTable/DataTable";
import FormControl from "../../formControl/FormControl";

export default function orderCrudForm(props) {
    const tableColumns = [
      {field: 'names', text: 'Nombres'},
      {field: 'email', text: 'Email'},
      {field: 'phone', text: 'Telefono'},
    ];

    const setComment = (e) => {
        props.setComment(e.target.value)
    };

    return <div className='formGeneric'>
        <div className="formInputs">
            <FormControl type="async-searcher" label="Flujo" value={props.workflow} setValue={props.setWorkflow} selectSearcher={props.searchWorkflow} />
            <FormControl type="textArea" label="Comentarios" value={props.comment} setValue={setComment} />
            <div className="inputSearcherSecundaryContainer">
              <FormControl type="async-searcher" label="Contacto" value={props.contact} setValue={props.setContact} selectSearcher={props.searchContact} />
              <button className="saveBtn" disabled={props.fetching} onClick={props.addContact}><i className="bi bi-plus-circle"></i></button>
            </div>
            <div className="inputSearcherSecundaryContainer">
              <FormControl type="searcher" label="Eliminar contacto" value={props.contactDel} setValue={props.setContactDel} options={props.contacts} />
              <button className="cancelBtn" disabled={props.fetching} onClick={props.removeContact}><i className="bi bi-x-lg"></i></button>
            </div>
            <DataTable headers={tableColumns} rows={props.contacts} />

        </div>
        <div className='formMessageContainer'>
                <p>{props.message}</p>
                {
                    props.fetching && <div className="formLoaderContainer">
                        <p>Cargando&#8230;</p>
                        <span className="formLoader"><i className="bi bi-arrow-repeat"></i></span>
                    </div>
                }
        </div>
        <div className="formControlsOptions">
            <button className="saveBtn" disabled={props.fetching} onClick={props.guardarFn}><i className="bi bi-box-arrow-in-right"></i></button>
            <button className="cancelBtn" disabled={props.fetching} onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
        {props.tableComponent}
    </div>
};
