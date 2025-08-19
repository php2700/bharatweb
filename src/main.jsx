import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ add this
import App from './App.jsx';
import './index.css'; // Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* 👈 wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
