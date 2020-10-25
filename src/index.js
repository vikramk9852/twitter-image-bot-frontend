import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './styles.scss';
import AppRouter from "./router/index";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="/" component={AppRouter} />
    </Router>
  </React.StrictMode>,
  rootElement
);
