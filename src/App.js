import './App.css';
import LoginScreen from './screens/Login/LoginScreen';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Landing = lazy(()=> import('./screens/Landing/LandingScreen'))
const Header = lazy(()=> import('./components/Header/Header'))
const WorkflowsScreen = lazy(()=> import('./screens/Workflows/WorkflowsScreen'))
const WorkflowStepsScreen = lazy(()=> import('./screens/WorkflowSteps/WorkflowStepsScreen'))
const UsersScreen = lazy(()=> import('./screens/Users/UsersScreen'))
const UserPermissionsScreen = lazy(()=> import('./screens/UserPermissions/UserPermissionsScreen'))
const ContactScreen = lazy(()=> import('./screens/Contact/ContacsScreen'))
const DelaysScreen = lazy(()=> import('./screens/Delay/DelaysScreen'))
const OrdersCrudScreen = lazy(()=> import('./screens/OrdersCrud/OrdersCrudScreen'))
const OrderDetailScreen = lazy(()=> import('./screens/OrderDetail/OrderDetailScreen'))
const ReportsScreen = lazy(()=> import('./screens/Reports/ReportsScreen'))
const ShiftsScreen = lazy(()=> import('./screens/Shifts/ShiftsScreen'))

function App() {
  const session = localStorage.getItem('token');

  if (session) {
    return (<>
      <Suspense fallback={<div className="loading">Loading&#8230;</div>}>
      <Header />
      <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/workflows/crud' element={<WorkflowsScreen />} />
          <Route path='/workflow_steps/crud/:workflowId' element={<WorkflowStepsScreen />} />
          <Route path='/users/crud' element={<UsersScreen />} />
          <Route path='/permissions/crud/:userId' element={<UserPermissionsScreen />} />
          <Route path='/contacts/crud' element={<ContactScreen />} />
          <Route path='/delays/crud' element={<DelaysScreen />} />
          <Route path='/orders/crud' element={<OrdersCrudScreen />} />
          <Route path='/order/:orderId/detail' element={<OrderDetailScreen />} />
          <Route path='/reports' element={<ReportsScreen />} />
          <Route path='/shifts' element={<ShiftsScreen />} />
        </Routes>
      </Suspense>
    </>);
  } else {
    return <LoginScreen />
  }
}

export default App;
