import HttpPetition from "../../helpers/HttpPetition";
import DataTable from "../../components/DataTable/DataTable";

import { useEffect, useState } from "react";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function StepGuide ({workflowId}) {

  const tableColumns = [
    {field: 'step', text: 'Paso'},
    {field: 'description', text: 'Comentarios'},
    {field: 'next_step', text: 'Pasos siguientes'}
  ];

  const getOrder = async () => {
    try {

      const response = await HttpPetition({
        url: base_url + `/api/v1/reports/workflow/${workflowId}/guide`,
        method: "GET",
      });

      if (response.status === 200) {
        const data = [];

        for (const step of response.data) {
          data.push({
            step: step.step,
            description: step.description,
            next_step: step.next_step || 'N/A'
          })
        }

        setData(data)
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error al consultar el flujo: " + error.message);
    }
  };

  const [data, setData] = useState([]);

  useEffect(()=> {getOrder()}, []);

  return <DataTable 
    headers={tableColumns}
    rows={data}
  />
}