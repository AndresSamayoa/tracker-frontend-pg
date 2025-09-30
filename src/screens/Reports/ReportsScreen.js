import DataTable from "../../components/DataTable/DataTable";
import WorkflowAverage from "../../components/reports/workflowAverage/workflowAverage";
import UserAverage from "../../components/reports/userAverage/userAverage";
import OrderStatus from "../../components/reports/ordersStatus/ordersStatus";
import HttpPetition from "../../helpers/HttpPetition";

import { useState } from 'react';
import moment from "moment";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function ReportScreen() {

  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(false);
  const [wfAvgSelected, setWfAvgSelected] = useState(false);
  const [usAvgSelected, setUsAvgSelected] = useState(false);
  const [orderStatusSelected, setOrderStatusSelected] = useState(false);

  const clear = () => {
    setTableColumns([])
  }

  const selectWfAvgSelected = () => {
    setWfAvgSelected(true);
    setUsAvgSelected(false);
    setOrderStatusSelected(false);
    setTableData([]);
    setTableColumns([
      {field: 'workflow_name', text: 'Flujo'},
      {field: 'average_time', text: 'Tiempo promedio (h)'},
      {field: 'average_time_step', text: 'Tiempo promedio por paso (h)'},
      {field: 'average_time_delay', text: 'Tiempo promedio por atrasos (h)'},
      {field: 'average_time_errors', text: 'Tiempo promedio por error (h)'},
      {field: 'average_steps', text: 'Numero promedio de pasos'},
      {field: 'average_delays', text: 'Numero promedio de atrasos por paso'},
      {field: 'average_errors', text: 'Numero promedio de errores por paso'}
    ]);
  };

  const selectUsAvgSelected = () => {
    setUsAvgSelected(true);
    setWfAvgSelected(false);
    setOrderStatusSelected(false);
    setTableData([]);
    setTableColumns([
      {field: 'user_names', text: 'Usuario'},
      {field: 'average_time', text: 'Tiempo promedio (h)'},
      {field: 'average_time_step', text: 'Tiempo promedio por paso (h)'},
      {field: 'average_time_delay', text: 'Tiempo promedio por atrasos (h)'},
      {field: 'average_time_errors', text: 'Tiempo promedio por error (h)'},
      {field: 'average_steps', text: 'Numero promedio de pasos'},
      {field: 'average_delays', text: 'Numero promedio de atrasos por paso'},
      {field: 'average_errors', text: 'Numero promedio de errores por paso'}
    ]);
  };

  const selectOrderStatusSelected = () => {
    setOrderStatusSelected(true);
    setWfAvgSelected(false);
    setUsAvgSelected(false);
    setTableData([]);
    setTableColumns([
      {field: 'order_id', text: 'Numero de orden'},
      {field: 'workflow_name', text: 'Flujo'},
      {field: 'user_names', text: 'Usuario'},
      {field: 'start_date', text: 'Fecha de inicio'},
      {field: 'end_date', text: 'Fecha de fin'},
      {field: 'contacts', text: 'Contactos'}
    ])
  };

  const getWorkflowAvg = async (start_date, end_date) => {
    try {
      if (fetching) return
      setFetching(true);

      const errores = [];
      if (!start_date) {
        errores.push('Debe seleccionar una fecha de inicio.')
      }

      if (!end_date) {
        errores.push('Debe seleccionar una fecha de fin.')
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMessage(mensajeError);
        setFetching(false);
        return;
      }

      const response = await HttpPetition({
        url: base_url + '/api/v1/reports/workflows/times/avg',
        method: 'GET',
        params: {
          start_date,
          end_date
        },
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const rows = [];
        for (const row of response.data) {
          rows.push({
            workflow_name: row.workflow_name,
            average_time: Number(row.average_time).toFixed(4) + ' h',
            average_time_step: Number(row.average_time_step).toFixed(4) + ' h',
            average_time_delay: Number(row.average_time_delay).toFixed(4) + ' h',
            average_time_errors: Number(row.average_time_errors).toFixed(4) + ' h',
            average_steps: Number(row.average_steps).toFixed(4) + ' por orden',
            average_delays: Number(row.average_delays).toFixed(4) + ' por paso',
            average_errors: Number(row.average_errors).toFixed(4) + ' por paso',
          });
        }
        setFetching(false);
        setTableData(rows)
      } else if (response.status === 404) {
        setFetching(false);
        setTableData([]);
      } else {
        setMessage(
          `No se pudo consultar el reporte, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setFetching(false);
      setMessage('Error al consultar el reporte: '+ error.message)
    }
  };

  const getUserAvg = async (start_date, end_date) => {
    try {
      if (fetching) return
      setFetching(true);

      const errores = [];
      if (!start_date) {
        errores.push('Debe seleccionar una fecha de inicio.')
      }

      if (!end_date) {
        errores.push('Debe seleccionar una fecha de fin.')
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMessage(mensajeError);
        setFetching(false);
        return;
      }

      const response = await HttpPetition({
        url: base_url + '/api/v1/reports/users/times/avg',
        method: 'GET',
        params: {
          start_date,
          end_date
        },
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const rows = [];
        for (const row of response.data) {
          rows.push({
            user_names: row.user_names,
            average_time: Number(row.average_time).toFixed(4) + ' h',
            average_time_step: Number(row.average_time_step).toFixed(4) + ' h',
            average_time_delay: Number(row.average_time_delay).toFixed(4) + ' h',
            average_time_errors: Number(row.average_time_errors).toFixed(4) + ' h',
            average_steps: Number(row.average_steps).toFixed(4) + ' por orden',
            average_delays: Number(row.average_delays).toFixed(4) + ' por paso',
            average_errors: Number(row.average_errors).toFixed(4) + ' por paso',
          });
        }
        setFetching(false);
        setTableData(rows)
      } else if (response.status === 404) {
        setFetching(false);
        setTableData([]);
      } else {
        setMessage(
          `No se pudo consultar el reporte, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setFetching(false);
      setMessage('Error al consultar el reporte: '+ error.message)
    }
  };

  const getOrderStatus = async (start_date, end_date, user, contact, completed) => {
    try {
      if (fetching) return
      setFetching(true);

      const errores = [];
      if (!start_date) {
        errores.push('Debe seleccionar una fecha de inicio.')
      }

      if (!end_date) {
        errores.push('Debe seleccionar una fecha de fin.')
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMessage(mensajeError);
        setFetching(false);
        return;
      }

      const response = await HttpPetition({
        url: base_url + '/api/v1/reports/order/status',
        method: 'GET',
        params: {
          start_date,
          end_date,
          user,
          contact,
          completed: completed ? 1 : 0
        },
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status === 200) {
        const rows = [];
        for (const row of response.data) {
          rows.push({
            order_id: row.order_id,
            workflow_name: row.workflow_name,
            user_names: row.user_names,
            start_date: moment(row.start_date).format('DD-MM-YY hh:mm a'),
            end_date: moment(row.end_date).format('DD-MM-YY hh:mm a'),
            contacts: row.contacts,
          });
        }
        setFetching(false);
        setTableData(rows)
      } else if (response.status === 404) {
        setFetching(false);
        setTableData([]);
      } else {
        setMessage(
          `No se pudo consultar el reporte, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setFetching(false);
      setMessage('Error al consultar el reporte: '+ error.message)
    }
  };

  return <div className="genericScreen">
    <div className="reportSelector">
      <button disabled={fetching} onClick={selectWfAvgSelected} className="selectReportBtn">Promedios por orden</button>
      <button disabled={fetching} onClick={selectUsAvgSelected} className="selectReportBtn">Promedios por usuario</button>
      <button disabled={fetching} onClick={selectOrderStatusSelected} className="selectReportBtn">Estado de ordenes</button>
    </div>
    <div className="reportsContainer">
    {wfAvgSelected && <WorkflowAverage 
      searchFn={getWorkflowAvg}
      cancelFn={clear}
      fetching={fetching}
      message={message}
    />}
    {usAvgSelected && <UserAverage 
      searchFn={getUserAvg}
      cancelFn={clear}
      fetching={fetching}
      message={message}
    />}
    {orderStatusSelected && <OrderStatus 
      searchFn={getOrderStatus}
      cancelFn={clear}
      fetching={fetching}
      message={message}
    />}
      {tableColumns.length > 0 &&<DataTable 
        headers={tableColumns}
        rows={tableData}
      />}
    </div>
  </div>
}
