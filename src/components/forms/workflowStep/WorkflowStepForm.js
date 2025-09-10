import DataTable from "../../DataTable/DataTable";
import FormControl from "../../formControl/FormControl";

export default function workflowStepForm(props) {
    const tableColumns = [
      {field: 'id', text: 'Id'},
      {field: 'name', text: 'Nombre del paso'},
    ];

    const setName = (e) => {
        props.setName(e.target.value)
    };

    const setActive = (e) => {
        props.setActive(e.target.checked)
    };

    const setNotify = (e) => {
        props.setNotify(e.target.checked)
    };

    const setObligatory = (e) => {
        props.setObligatory(e.target.checked)
    };

    const setDescription = (e) => {
        props.setDescription(e.target.value)
    };

    const setPreviousStep = (v) => {
      props.setPreviousStep(v);
    }

    const setPreviousStepDel = (v) => {
      props.setPreviousStepDel(v);
    }

    return <div className='formGeneric'>
        <div className="formInputs">
            <FormControl type="text" label="Name" value={props.name} setValue={setName} />
            <FormControl type="checkbox" label="Activo" value={props.active} setValue={setActive} />
            <FormControl type="checkbox" label="Notifica" value={props.notify} setValue={setNotify} />
            <FormControl type="checkbox" label="Obligatorio" value={props.obligatory} setValue={setObligatory} />
            <div className="inputSearcherSecundaryContainer">
              <FormControl type="searcher" label="Pasos anteriores" value={props.previousStep} setValue={setPreviousStep} options={props.workflowSteps} />
              <button className="saveBtn" disabled={props.fetching} onClick={props.addPreviousStep}><i className="bi bi-plus-circle"></i></button>
            </div>
            <div className="inputSearcherSecundaryContainer">
              <FormControl type="searcher" label="Eliminar paso" value={props.previousStepDel} setValue={setPreviousStepDel} options={props.previousSteps} />
              <button className="cancelBtn" disabled={props.fetching} onClick={props.removePreviousStep}><i className="bi bi-x-lg"></i></button>
            </div>
            <DataTable headers={tableColumns} rows={props.previousSteps} />
            <FormControl type="textArea" label="Descripcion" value={props.description} setValue={setDescription} />
            
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
