import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import '@fontsource/roboto';
import MessageIcon from '@material-ui/icons/Message';
import HistoryIcon from '@material-ui/icons/History';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import "./App.css"
import logo from './assets/logo.png'
import Fila from './Pages/Fila';
import Historico from './Pages/Historico';
import Estatistica from './Pages/Estatistica';

function App() {
  return (
    <div>
      <div id="head">
        <div style={{ marginLeft:'2%', width:'16%', display:'flex', justifyContent:'center' }}>
          <img src={logo} alt="logo" width={81.85} height={75.95} />
        </div>
        <Typography variant="h3" gutterBottom>
          Clínica Bem Viver
        </Typography>
      </div>
      <div id="painel">
        <div id="side-menu">
          <div>
            <div>
              <a href="/fila"><p style={{ display: 'flex', alignItems: "center" }}><MessageIcon />Fila</p></a>
            </div>
            <div>
              <a href="/historico"><p style={{ display: 'flex', alignItems: "center" }}><HistoryIcon />Histórico</p></a>
            </div>
            <div>
              <a href="/estatistica"><p style={{ display: 'flex', alignItems: "center" }}><ShowChartIcon />Estatísticas</p></a>
            </div>
          </div>
        </div>
        <div style={{ width: '78%' }}>
          <Router>
            <Switch>
              <Route path="/fila">
                <Fila />
              </Route>
              <Route path="/historico">
                <Historico />
              </Route>
              <Route path="/estatistica">
                <Estatistica />
              </Route>
              <Route path="/">
                <Fila />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
