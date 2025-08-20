import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind CSS
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { BrowserRouter } from "react-router-dom"; // ✅ router

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>       {/* 👈 Redux wrapper */}
      <BrowserRouter>             {/* 👈 Router wrapper */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
