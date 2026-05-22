import React from "react";
import ReactDOM from "react-dom/client";
import Home_Page from "./Home_Page";
import Menu from "./Menu.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="app-container">
      <Home_Page />
      <Menu />
    </div>
  </React.StrictMode>,
);
