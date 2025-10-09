import Searcher from "../../components/Searcher/Searcher";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function TrackerScreen() {
  const [searchParams] = useSearchParams();

  const getData = async () => {
    try {
      if (fetching) return;
      setFetching(true);

      const errores = [];

      console.log(param)
      if (!param) {
        errores.push("Debe ingresar el código de la orden.");
      } else if(/[^0-9]+/gm.test(param)) {
        errores.push("Solo se deben ingresar valores numéricos.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMessage(mensajeError);
        setFetching(false);
        return;
      }

      const response = await axios({
        url: base_url + "/api/v1/orders/steps/"+param,
        method: "GET",
        validateStatus: () => true,
        timeout: 30000,
      });

      if (response.status === 200) {
        const rows = [];
        for (const row of response.data.steps) {
          let icon ;
          switch (row.type) {
            case 'Paso':
              icon = <i class="bi bi-check2-circle"></i>
            break;
            case 'Atraso':
              icon = <i class="bi bi-exclamation-circle"></i>
            break;
            case 'Error':
              icon = <i class="bi bi-x-circle"></i>
            break;
          }
          if (row.ending_step) icon = <i class="bi bi-flag"></i>
          rows.push(
            <div className="trackerItemContainer">
              <div className="trackerLogoContainer">
                {icon}
              </div>
              <div className="trackerTextContainer">
                <h1 className="trackerTitleText">{row.type}: {row.step_name}</h1>
                <h1 className="trackerDateText">{moment(row.date).format('DD/MM/YYYY hh:mm a')}</h1>
              </div>
            </div>
          );
        }
        setFetching(false);
        setSteps(rows);
      } else if (response.status === 404) {
        setMessage('No se encontro la orden.')
        setFetching(false);
      } else {
        setMessage(
          `No se pudo consultar la orden, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setFetching(false);
      setMessage("Error al consultar la orden: " + error.message);
    }
  };

  const [param, setParam] = useState(searchParams.get('orderId') || '');
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(()=>{
    if (param > 0) {
      getData()
    }
  }, [])

  return <div className="genericScreen">
    <div className="titleContainer">
      <h1>Estado de orden</h1>
    </div>
    <div className="trackerContainer">
      <Searcher 
        useType={false}
        useDateRange={false}

        placeHolder='Código'
        param={param}
        setParam={setParam}

        searchFn={getData}
        cancelFn={() => setSteps([])}
      />
      <div className='formMessageContainer'>
        <p>{message}</p>
        {
          fetching && <div className="formLoaderContainer">
            <p>Cargando&#8230;</p>
            <span className="formLoader"><i className="bi bi-arrow-repeat"></i></span>
          </div>
        }
        </div>
      <div className="stepsContainer">
        {steps}
      </div>
    </div>
  </div>
}
