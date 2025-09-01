import logo from './logo.svg';
import './App.css';
import LoginScreen from './screens/Login/LoginScreen';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

function App() {
  const session = localStorage.getItem('token');

  if (session) {
    return (<>
      <Suspense fallback={<div class="loading">Loading&#8230;</div>}>
      <Routes>
          <Route path='/' element={<div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p className="text-3xl font-bold underline">
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>} />
        </Routes>
      </Suspense>
    </>);
  } else {
    return <LoginScreen />
  }
}

export default App;
