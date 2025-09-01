import FormControl from "../../formControl/FormControl";

export default function loginForm(props) {

    const setEmail = (e) => {
        props.setEmail(e.target.value)
    };
    const setPassword = (e) => {
        props.setPassword(e.target.value)
    };

    return <div className='formGeneric'>
        <div className="formInputs">
            <FormControl type="text" label="Email" value={props.email} setValue={setEmail} />
            <FormControl type="password" label="Clave" value={props.password} setValue={setPassword} />
        </div>
        <div className='formMessageContainer'>
                <p>{props.mensaje}</p>
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
