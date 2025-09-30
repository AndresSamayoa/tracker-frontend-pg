import FormControl from "../../formControl/FormControl";

export default function delayForm(props) {

    const setName = (e) => {
        props.setName(e.target.value)
    };

    const setDescription = (e) => {
        props.setDescription(e.target.value)
    };

    const setActive = (e) => {
        props.setActive(e.target.checked)
    };

    const setNotify = (e) => {
        props.setNotify(e.target.checked)
    };

    const setError = (e) => {
        props.setError(e.target.checked)
    };

    return <div className='formGeneric'>
        <div className="formInputs">
            <FormControl type="text" label="Nombre" value={props.name} setValue={setName} />
            <FormControl type="checkbox" label="Activo" value={props.active} setValue={setActive} />
            <FormControl type="checkbox" label="Notifica al cliente?" value={props.notify} setValue={setNotify} />
            <FormControl type="checkbox" label="Es error?" value={props.error} setValue={setError} />
            <FormControl type="textArea" label="Descripcion" value={props.description} setValue={setDescription} />
            <FormControl type="async-searcher" label="Supervisor" value={props.supervisor} setValue={props.setSupervisor} selectSearcher={props.searchSupervisor} />
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
    </div>
};
