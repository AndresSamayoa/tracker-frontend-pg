import FormControl from "../../formControl/FormControl";

export default function delayForm(props) {

    const setEndDate = (e) => {
        props.setEndDate(e.target.value)
    };

    const setStartDate = (e) => {
        props.setStartDate(e.target.value)
    };

    return <div className='formGeneric'>
        <div className="formInputs">
            <FormControl type="async-searcher" label="Usuario" value={props.user} setValue={props.setUser} selectSearcher={props.searchUser} />
            <FormControl type="datetime" label="Fecha y hora de inicio" value={props.startDate} setValue={setStartDate} />
            <FormControl type="datetime" label="Fecha y hora de fin" value={props.endDate} setValue={setEndDate} />
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
