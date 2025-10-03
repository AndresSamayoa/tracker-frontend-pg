import HttpPetition from '../../helpers/HttpPetition';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function Header () {

    const logout = () => {
        HttpPetition({
            url: base_url + '/api/v1/logout',
            method: 'DELETE',
            validateStatus: () => true,
        });

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.assign('/')
    }

  const getData = async () => {
    try {
      const response = await HttpPetition({
        url: base_url + `/api/v1/users/permissions/user/${localStorage.getItem('userId')}`,
        method: "GET",
      });

      if (response.status === 200) {
        const areas = [];
        for (const permission of response.data) {
          if (!areas.includes(permission.area)) areas.push(permission.area)
        }
        setAreas(areas);
      } else {
        console.log(response.data)
      }
    } catch (error) {
      console.log("Error al consultar los permisos: " + error.message);
    }
  }

  const [areas, setAreas] = useState([]);

  useEffect(()=>{getData()}, [])

  return <div className='headerContainer'>
    <div className='headerLogoContainer'>
      <Link to='/' className='headerLink'>Tracker</Link>
    </div>
    <div className='headerLinks'>
      {areas.includes('workflows') && <Link to='/workflows/crud' className='headerLink'><b>Flujos</b></Link>}
      {areas.includes('users') && <Link to='/users/crud' className='headerLink'><b>Usuarios</b></Link>}
      {areas.includes('contacts') && <Link to='/contacts/crud' className='headerLink'><b>Contactos</b></Link>}
      {areas.includes('delays') && <Link to='/delays/crud' className='headerLink'><b>Atrasos</b></Link>}
      {areas.includes('orders') && <Link to='/orders/crud' className='headerLink'><b>Ordenes</b></Link>}
      {areas.includes('reports') && <Link to='/reports' className='headerLink'><b>Reportes</b></Link>}
      {areas.includes('shifts') && <Link to='/shifts' className='headerLink'><b>Turnos</b></Link>}
    </div>
    <div className='headerLogoContainer'>
      <p className='headerLink ActionItem' onClick={logout}>Cerrar sesión</p>
    </div>
  </div>
}