import HttpPetition from "../../helpers/HttpPetition";
import DataTable from "../../components/DataTable/DataTable";
import WorkflowStepForm from "../../components/forms/workflowStep/WorkflowStepForm";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function WorkflowScreen() {
  const {workflowId} = useParams();
  const tableColumns = [
    {field: 'name', text: 'Nombre del flujo'},
    {field: 'description', text: 'Descripcion'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setWorkflowStepId(0);
    setName('');
    setActive(true);
    setObligatory(false);
    setNotify(false);
    setDescription('');
    setPreviousSteps([]);
    setPreviousStep(null);
    setMessage('');
  };

  const saveForm = async () => {
    try {
      let url ;
      let method ;
      let steps ;
      if (workflowStepId > 0) {
        url = base_url + "/api/v1/workflow_steps/" + workflowStepId;
        method = 'PUT';
        steps = previousSteps.map(ps => {return ps.connectionId ? 
          {previous_step: ps.id, connection_id: ps.connectionId} 
          : {previous_step: ps.id}}
        );
      } else {
        url = base_url + "/api/v1/workflow_steps";
        method = 'POST';
        steps = previousSteps.map(ps => ps.id);
      }
      if (fetching) {
        return
      }
      setFetching(true);
      const errores = [];

      if (!name || name.trim().length < 1) {
        errores.push("El nombre es un campo obligatorio.");
      }
      if (!description || description.trim().length < 1) {
        errores.push("La descripcion es un campo obligatorio.");
      }
      if (typeof active != 'boolean') {
        errores.push("Debe seleccionar si el paso esta activo.");
      }
      if (typeof notify != 'boolean') {
        errores.push("Debe seleccionar si el paso envia notificacion.");
      }
      if (typeof obligatory != 'boolean') {
        errores.push("Debe seleccionar si el paso es obligatorio.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMessage(mensajeError);
        setFetching(false);
        return;
      }

      const response = await HttpPetition({
        url: url,
        method: method,
        data: {
          workflow_id: workflowId,
          name: name.trim(),
          active: active,
          notify: notify,
          obligatory: obligatory,
          description: description.trim(),
          previous_steps: steps
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false)
        getWorkflow();
        setMessage("Flujo guardado");
      } else {
        setMessage(
          `No se pudo iniciar sesión, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al iniciar sesión: " + error.message);
      setFetching(false);
    }
  };

  const unselectStep = () => {
    const data = [];
    for (const step of previousSteps) {
      if(step.id !== previousStepDel.value) data.push(step);
    }
    setPreviousSteps(data);
    setPreviousStepDel(null);
  }

  const selectStep = () => {
    if(previousStep === null) return;
    if(previousSteps.findIndex(s => s.id === previousStep.value) > 0) {
      setPreviousStep(null);
      return;
    }

    previousSteps.push({
      ...previousStep,
      id: previousStep.value,
      name: previousStep.label,
    });

    setPreviousSteps(previousSteps);
    setPreviousStep(null);
  }

  const deleteItem = async (workflowStep) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/workflow_steps/'+workflowStep,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessage('Exito al eliminar');
        getWorkflowSteps();
      } else {
        setMessage(`'Error al eliminar, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessage('Error al eliminar la cita: ' + error.message);
    }
  };

  const getWorkflow = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/workflows/${workflowId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setWorkflowName(response.data.name);
        setFetching(false);
        getWorkflowSteps();
      } else {
        console.log(response.data)
        setFetching(false);
      }
    } catch (error) {
      console.log("Error al consultar el flujo de trabajo: " + error.message);
      setFetching(false);
    }
  }

  const getWorkflowSteps = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/workflow_steps/workflow/${workflowId}`,
        method: "GET",
      });

      if (response.status === 200) {
        const data = [];
        const select = [];
        for (const step of response.data) {
          const ps = step.previous_steps ? step.previous_steps.map(step => {return {
            value: step.previous_step,
            label: step.name,
            id: step.previous_step,
            connectionId: step.connection_id,
            name: step.name
          }}) : [];
          data.push({
            name: step.name,
            description: step.description,
            actions: <div className='ActionContainer'>
                    <i 
                      onClick={()=>{
                        setWorkflowStepId(step.workflow_step_id);
                        setName(step.name);
                        setActive(step.active);
                        setObligatory(step.obligatory);
                        setNotify(step.notify);
                        setDescription(step.description);
                        setPreviousSteps(ps);
                      }} 
                      class="bi bi-pencil-square ActionItem"
                    ></i>
                    {!(step.ending_step || step.starting_step) && <i
                      onClick={()=>deleteItem(step.workflow_step_id)} 
                      style={{color:"red"}} 
                      class="bi bi-trash ActionItem"
                    ></i>}
                </div>
          });
          select.push({
            value: step.workflow_step_id,
            label: step.name,
          })
        }
        setStepsSelect(select);
        setTableData(data);
        setFetching(false);
      } else {
        console.log(response.data)
        setFetching(false);
      }
    } catch (error) {
      console.log("Error al consultar el flujo de trabajo: " + error.message);
      setFetching(false);
    }
  }

  useEffect(()=>{
    getWorkflow();
  },[])

  const [workflowName, setWorkflowName] = useState('');
  const [workflowStepId, setWorkflowStepId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [obligatory, setObligatory] = useState(false);
  const [notify, setNotify] = useState(false);
  const [previousSteps, setPreviousSteps] = useState([]);
  const [previousStep, setPreviousStep] = useState(null);
  const [previousStepDel, setPreviousStepDel] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [stepsSelect, setStepsSelect] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState("");

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Pasos de: {workflowName}</h1>
      </div>
      <WorkflowStepForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setName={setName}
        setDescription={setDescription}
        setActive={setActive}
        setObligatory={setObligatory}
        setNotify={setNotify}
        setPreviousStep={setPreviousStep}
        setPreviousStepDel={setPreviousStepDel}
        removePreviousStep={unselectStep}
        addPreviousStep={selectStep}
        name={name}
        description={description}
        active={active}
        obligatory={obligatory}
        notify={notify}
        previousSteps={previousSteps}
        previousStep={previousStep}
        previousStepDel={previousStepDel}
        workflowSteps={stepsSelect}
        fetching={fetching}
        message={message}
        tableComponent={
          <DataTable 
            headers={tableColumns}
            rows={tableData}
          />
        }
      />
    </div>
  );
}
