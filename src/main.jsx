import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './ThemeContext.jsx'; 
import { Provider } from 'react-redux'; // REDUX
import { store } from './store.js';     // REDUX

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* REDUX WRAPPER */}
    <Provider store={store}>
      {/* CONTEXT WRAPPER */}
      <ThemeProvider> 
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)