import FormControl from "../../formControl/FormControl";

export default function userPermissionForm(props) {

    const setSelf = (e) => {
        console.log(e.target.value)
        props.setSelf(e.target.checked)
    };

    const setSubordinates = (e) => {
        props.setSubordinates(e.target.checked)
    };

    const setAll = (e) => {
        props.setAll(e.target.checked)
    };

    return <div className='formGeneric'>
        {props.userPermissionId > 0 &&<><div className="titleContainer">
                <h1>{props.area}: {props.action}</h1>
            </div>
            <div className="formInputs">
                {props.selfDisplay && <FormControl type="checkbox" label="Propios" value={props.self} setValue={setSelf} />}
                {props.subordinatesDisplay && <FormControl type="checkbox" label="Subordinados" value={props.subordinates} setValue={setSubordinates} />}
                {props.allDisplay && <FormControl type="checkbox" label="Todos" value={props.all} setValue={setAll} />}
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
        </>}
        {props.tableComponent}
    </div>
};
