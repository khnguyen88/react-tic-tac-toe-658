/* 
Khiem Nguyen - CIS 658
Date - 2023/31/03

File's Purpose - The file injects and renders the app component in the element w/ the root id in the index.html where it can be viewed in the browser. 
Hybrid code from npx project generation and code paste in from the start of the tutorial.
*/

import React, { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
