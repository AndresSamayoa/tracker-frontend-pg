import './App.css';
import LoginScreen from './screens/Login/LoginScreen';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Landing = lazy(()=> import('./screens/Landing/LandingScreen'))
const Header = lazy(()=> import('./components/Header/Header'))
const WorkflowsScreen = lazy(()=> import('./screens/Workflows/WorkflowsScreen'))

function App() {
  const session = localStorage.getItem('token');

  if (session) {
    return (<>
      <Suspense fallback={<div class="loading">Loading&#8230;</div>}>
      <Header />
      <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/workflows/crud' element={<WorkflowsScreen />} />
        </Routes>
      </Suspense>
    </>);
  } else {
    return <LoginScreen />
  }
}

export default App;
