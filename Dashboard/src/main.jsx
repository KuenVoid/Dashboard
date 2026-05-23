import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Main_Panel";

document.documentElement.setAttribute("data-theme", "carbon");
// Remove right click menu
document.addEventListener("contextmenu", (e) => {event.preventDefault();});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
