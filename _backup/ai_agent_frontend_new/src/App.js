import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Models from './components/Models';
import Tasks from './components/Tasks';
import NavBar from './components/NavBar';
import logo from './logo.svg';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        {isAuthenticated && <NavBar />}
        <Switch>
          <Route exact path="/" render={() => (
            isAuthenticated ? <Redirect to="/models" /> : <Login />
          )} />
          <Route path="/register" component={Register} />
          <Route path="/models" render={() => (
            isAuthenticated ? <Models /> : <Redirect to="/" />
          )} />
          <Route path="/tasks" render={() => (
            isAuthenticated ? <Tasks /> : <Redirect to="/" />
          )} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;