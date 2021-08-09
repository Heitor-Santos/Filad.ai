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
    <Container>
      <Box id="head">
        <img src={logo} alt="logo" width={160} height={57} />
        <Typography variant="h3" gutterBottom>
          Clínica Bem Viver
        </Typography>
      </Box>
      <Grid container>
        <Grid item lg={2} id="side-menu">
          <div>
            <a href="/fila"><p><MessageIcon /><Typography>Fila</Typography></p></a>
            <a href="/historico"><p><HistoryIcon /><Typography>Histórico</Typography></p></a>
            <a href="/estatistica"><p><ShowChartIcon /><Typography>Estatísticas</Typography></p></a>
          </div>
        </Grid>
        <Grid item lg={10}>
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
            </Switch>
          </Router>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
