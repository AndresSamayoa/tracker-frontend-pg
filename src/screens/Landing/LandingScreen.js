import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DataTable from "../../components/DataTable/DataTable";
import HttpPetition from "../../helpers/HttpPetition";
import moment from "moment";
import Loader from "../../Loader/Loader";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function LoginScreen() {
  const headers = [
    {"field": "order_id", "text": "Codigo orden"},
    {"field": "user_names", "text": "Usuario"},
    {"field": "workflow_name", "text": "Flujo"},
    {"field": "comment", "text": "Comentario"},
    {"field": "actions", "text": "Acciones"}
  ]

  const deleteOrder = async(orderId) => {
    try {
      console.log(fetching)
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/orders/${orderId}`,
        method: 'DELETE',
      });

      if (response.status === 200) {
        getOrders();
        setFetching(false);
      } else {
        setMessage(
          `No se pudo eliminar la orden, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al eliminar la orden: " + error.message);
      setFetching(false);
    }
  }

  const getOrders = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/orders/status/1/user/${localStorage.getItem('userId')}`,
        method: "GET",
      });

      if (response.status === 200) {
        const ordersFormat = [];
        for (const order of response.data) {
          ordersFormat.push({
            order_id: order.order_id,
            user_names: order.user_names,
            workflow_name: order.workflow_name,
            comment: order.comment,
            actions: <div className='ActionContainer'>
                  <Link to={'/order/'+order.order_id+'/detail'}> <i
                                style={{color:"blue"}} 
                                class="bi bi-geo-alt ActionItem"
                            ></i>
                  </Link>
                  <i
                      disabled={fetching}
                      onClick={()=>deleteOrder(order.order_id)} 
                      style={{color:"red"}} 
                      class="bi bi-trash ActionItem"
                  ></i>
              </div>
          })
        }
        setPendingOrders(ordersFormat);
      } else if (response.status === 404) {
        setMessage('No se encontraron ordenes pendientes')
        setPendingOrders([]);
        setFetching(false);
      } else {
        setMessage(
          `No se pudo consultar las ordenes pendientes, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al consultar las ordenes pendientes: " + error.message);
      setFetching(false);
    }
  };

  const getUserData = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/users/${localStorage.getItem('userId')}`,
        method: "GET",
      });

      if (response.status === 200) {
        console.log(response.data)
        setUserNames(response.data.names);
        setFetching(false);
      } else {
        console.log(response.data)
        setFetching(false);
      }
    } catch (error) {
      console.log("Error al consultar las ordenes pendientes: " + error.message);
      setFetching(false);
    }
  };

  const getShiftStatus = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/shifts/pending/${localStorage.getItem('userId')}`,
        method: "GET",
      });

      if (response.status === 200) {
        console.log(response.data)
        setShiftId(response.data.shift_id);
        setShiftStart(response.data.start_date);
        setShiftEnd(response.data.end_date);
        setFetching(false);
      } else if (response.status === 404) {
        setShiftId(null);
        setShiftStart(null);
        setShiftEnd(null);
        setFetching(false);
      } else {
        console.log(response.data)
        setFetching(false);
      }
    } catch (error) {
      console.log("Error al consultar las ordenes pendientes: " + error.message);
      setFetching(false);
    }
  };

  const manageShiftStatus = async () => {
    try {
      console.log(fetching)
      if (fetching) {
        return
      }
      setFetching(true);
      const url = base_url + (!shiftId ? '/api/v1/shifts/start' : `/api/v1/shifts/${shiftId}/end`);
      const method = !shiftId ? 'POST' : 'PUT';

      const response = await HttpPetition({
        url,
        method,
        data: !shiftId ? {user_id: Number(localStorage.getItem('userId'))} : null
      });

      if (response.status === 200) {
        getShiftStatus();
        setFetching(false);
      } else {
        setFetching(false);
      }
    } catch (error) {
      console.log("Error al consultar las ordenes pendientes: " + error.message);
      setFetching(false);
    }
  };

  const [shiftId, setShiftId] = useState(null);
  const [shiftStart, setShiftStart] = useState(null);
  const [shiftEnd, setShiftEnd] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [userNames, setUserNames] = useState('');
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(()=>{
    getOrders();
    getUserData();
  },[]);

  useEffect(()=>{
    getShiftStatus();
  },[shiftId])

  return (
    <div className="genericScreen">
      <div className="detailTitleContainer">
        <h1>Bienvenido {userNames}</h1>
      </div>
      <div className='detailGenericContainer'>
        <div className="landingShiftContainer">
          {!shiftId && <button disabled={fetching} className="shiftBtn" onClick={manageShiftStatus}>Iniciar Turno</button>}
          {shiftId && shiftStart && <h3>Inicio de turno {moment(shiftStart, 'YYYY-MM-DDThh:mm:ss').format('DD-MM-YYYY hh:mm a')}</h3>}
          {shiftId && shiftEnd && <h3>Fin de turno {moment(shiftEnd, 'YYYY-MM-DDThh:mm:ss').format('DD-MM-YYYY hh:mm a')}</h3>}
          {shiftId && !shiftEnd && <button className="shiftBtn" disabled={fetching} onClick={manageShiftStatus}>Finalizar turno</button>}
        </div>
        <Loader show={fetching}/>
        <div className="titleContainer">
          <h1>Ordenes pendientes</h1>
        </div>
        {message}
        {pendingOrders.length > 0 &&
          <DataTable 
            headers={headers}
            rows={pendingOrders}
          />
        }
      </div>
    </div>
  );
}
