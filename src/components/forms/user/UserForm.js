import FormControl from "../../formControl/FormControl";

export default function userForm(props) {

    const setNames = (e) => {
        props.setNames(e.target.value)
    };

    const setActive = (e) => {
        props.setActive(e.target.checked)
    };

    const setAdmin = (e) => {
        props.setAdmin(e.target.checked)
    };

    const setPhone = (e) => {
        props.setPhone(e.target.value.replace(/[^0-9]+/gm, '').trim().substring(0,14))
    };

    const setEmail = (e) => {
        props.setEmail(e.target.value)
    };

    const setPassword = (e) => {
        props.setPassword(e.target.value)
    };

    return <div className='formGeneric'>
        <div className="formInputs">
            <FormControl type="text" label="Nombre" value={props.names} setValue={setNames} />
            <FormControl type="text" label="Telefono" value={props.phone} setValue={setPhone} />
            <FormControl type="text" label="Email" value={props.email} setValue={setEmail} />
            <FormControl type="password" label="Clave" value={props.password} setValue={setPassword} />
            <FormControl type="checkbox" label="Administrador" value={props.admin} setValue={setAdmin} />
            <FormControl type="checkbox" label="Activo" value={props.active} setValue={setActive} />
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
