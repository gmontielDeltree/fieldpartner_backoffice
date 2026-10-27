// import React from 'react';
import ReactDOM from 'react-dom/client'
// semantic-ui primero: fija html{font-size:14px} (el theme trabaja sobre esa base)
// y foundation.css, que se carga después con el theme, lo pone a tono.
import 'semantic-ui-css/semantic.min.css'
import { FieldpartnerBackoffice } from './FieldpartnerBackoffice'



ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <FieldpartnerBackoffice />
  // </React.StrictMode>,
)
