import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <App />
    </BrowserRouter>

);
