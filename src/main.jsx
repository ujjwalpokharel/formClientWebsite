import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const container = document.getElementById("carekernel-inquiry-widget");

const { organisationid, formid } = container.dataset;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App organisationId={organisationid} initialFormId={formid} />
  </React.StrictMode>
);
