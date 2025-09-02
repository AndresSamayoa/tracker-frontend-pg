import './App.css';
import LoginScreen from './screens/Login/LoginScreen';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Landing = lazy(()=> import('./screens/Landing/LandingScreen'))

function App() {
  const session = localStorage.getItem('token');

  if (session) {
    return (<>
      <Suspense fallback={<div class="loading">Loading&#8230;</div>}>
      <Routes>
          <Route path='/' element={<Landing />} />
        </Routes>
      </Suspense>
    </>);
  } else {
    return <LoginScreen />
  }
}

export default App;
