import FormControl from "../../formControl/FormControl";

export default function contactForm(props) {

    const setNames = (e) => {
        props.setNames(e.target.value)
    };

    const setPhone = (e) => {
        props.setPhone(e.target.value.replace(/[^0-9]+/gm, '').trim().substring(0,14))
    };

    const setEmail = (e) => {
        props.setEmail(e.target.value)
    };

    return <div className='formGeneric'>
        <div className="formInputs">
            <FormControl type="text" label="Nombre" value={props.names} setValue={setNames} />
            <FormControl type="text" label="Telefono" value={props.phone} setValue={setPhone} />
            <FormControl type="text" label="Email" value={props.email} setValue={setEmail} />
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
