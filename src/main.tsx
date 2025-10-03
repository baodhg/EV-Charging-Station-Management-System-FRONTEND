import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with id 'root' was not found.");
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!googleClientId) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google sign-in will be disabled.");
}

const app = (
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);

ReactDOM.createRoot(rootElement).render(app);
