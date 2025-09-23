import HttpPetition from "../../helpers/HttpPetition";
import DataTable from "../../components/DataTable/DataTable";
import UserPermissionForm from "../../components/forms/userPermission/UserPermissionForm";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function WorkflowScreen() {
  const {userId} = useParams();
  const tableColumns = [
    {field: 'area', text: 'Area'},
    {field: 'action', text: 'Accion'},
    {field: 'permissions', text: 'Permisos'},
    {field: 'actions', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setUserPermissionId(0);
    setSelf(true);
    setSubordinates(true);
    setAll(false);
    setArea(null);
    setSelfDisplay(true);
    setSubordinatesDisplay(true);
    setAllDisplay(true);
    setAction(null);
    setAreaDisp(null);
    setActionDisp(null);
    setMessage('');
  };

  const saveForm = async () => {
    try {
      const permissions = []
      let cpSelf = self;
      if (fetching) {
        return
      }
      setFetching(true);
      const errores = [];

      if (typeof self != 'boolean') {
        errores.push("Debe seleccionar si tiene permisos sobre si.");
      }
      if (typeof subordinates != 'boolean') {
        errores.push("Debe seleccionar si tiene permisos sobre sus subordinados.");
      }
      if (typeof all != 'boolean') {
        errores.push("Debe seleccionar si tiene permisos sobre todos.");
      }

      if ((area === 'users' || area === 'shifts' || area === 'permissions') && action === 'read') {
        cpSelf = true;
      }

      if (cpSelf) permissions.push('self');
      if (subordinates) permissions.push('subordinates');
      if (all) permissions.push('all');

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMessage(mensajeError);
        setFetching(false);
        return;
      }

      const response = await HttpPetition({
        url: base_url + "/api/v1/users/permissions/" + userPermissionId,
        method: 'PUT',
        data: {
          area: area,
          action: action,
          user_id: userId,
          types: permissions
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        cancelForm();
        setFetching(false)
        getUser();
        setMessage("Permiso guardado");
      } else {
        setMessage(
          `No se pudo guardar, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
        setFetching(false);
      }
    } catch (error) {
      setMessage("Error al guardar: " + error.message);
      setFetching(false);
    }
  };

  const getUser = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/users/${userId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setUserName(response.data.names);
        setFetching(false);
        getPermissions();
      } else {
        console.log(response.data)
        setFetching(false);
      }
    } catch (error) {
      console.log("Error al consultar el usuario: " + error.message);
      setFetching(false);
    }
  }

  const getPermissions = async () => {
    try {
      if (fetching) {
        return
      }
      setFetching(true);

      const response = await HttpPetition({
        url: base_url + `/api/v1/users/permissions/user/${userId}`,
        method: "GET",
      });

      if (response.status === 200) {
        const data = [];
        for (const perm of response.data) {
          data.push({
            area: perm.area_display,
            action: perm.action_display,
            permissions: perm.permissions_display.join(', ') || 'N/A',
            actions: <div className='ActionContainer'>
                    <i 
                      onClick={()=>{
                        setUserPermissionId(perm.permission_id);
                        setSelf(perm.permissions.includes('self'));
                        setSubordinates(perm.permissions.includes('subordinates'));
                        setAll(perm.permissions.includes('all'));
                        setArea(perm.area);
                        setSelfDisplay(perm.permission_options.includes('self'));
                        setSubordinatesDisplay(perm.permission_options.includes('subordinates'));
                        setAllDisplay(perm.permission_options.includes('all'));
                        setAction(perm.action);
                        setAreaDisp(perm.area_display);
                        setActionDisp(perm.action_display);
                      }} 
                      class="bi bi-pencil-square ActionItem"
                    ></i>
                </div>
          });
        }
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
    getUser();
  },[])

  const [userName, setUserName] = useState('');
  const [userPermissionId, setUserPermissionId] = useState(0);
  const [self, setSelf] = useState(true);
  const [subordinates, setSubordinates] = useState(true);
  const [all, setAll] = useState(false);
  const [selfDisplay, setSelfDisplay] = useState(true);
  const [subordinatesDisplay, setSubordinatesDisplay] = useState(true);
  const [allDisplay, setAllDisplay] = useState(true);
  const [area, setArea] = useState(null);
  const [action, setAction] = useState(null);
  const [areaDisp, setAreaDisp] = useState(null);
  const [actionDisp, setActionDisp] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState("");

  return (
    <div className="genericScreen">
      <div className="titleContainer">
        <h1>Permisos de: {userName}</h1>
      </div>
      <UserPermissionForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setSelf={setSelf}
        setSubordinates={setSubordinates}
        setAll={setAll}
        userPermissionId={userPermissionId}
        area={areaDisp}
        action={actionDisp}
        self={self}
        subordinates={subordinates}
        all={all}
        selfDisplay={selfDisplay}
        subordinatesDisplay={subordinatesDisplay}
        allDisplay={allDisplay}
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
