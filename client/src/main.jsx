import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import { store } from './slices/store/store.js';
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
  import {BrowserRouter} from "react-router-dom"
  const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
createRoot(document.getElementById('root')).render(
   <StrictMode>
     <BrowserRouter>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={clientId}>
           <App />
        </GoogleOAuthProvider>
       
         <Toaster/>
      </Provider>
    </BrowserRouter>
  </StrictMode>
    
  
)
