import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://evejetveticfdhpfvbkt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZWpldHZldGljZmRocGZ2Ymt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3MDI2MTEsImV4cCI6MjAwNTI3ODYxMX0.PjFuB902AYUHiS2xcMPBHn5wQjjVW3yBLUbX6zB01YM" 
);
//340914669515-mf5iiiob9nhsbvmbilvhhkvctq9ibbk6.apps.googleusercontent.com
//https://cwjfajifsmopiqnavtqx.supabase.co/auth/v1/callback
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
);


reportWebVitals();
