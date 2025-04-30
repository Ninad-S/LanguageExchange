import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

console.log("Starting React Application...");

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, rendering React app...");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("React Application Rendered.");