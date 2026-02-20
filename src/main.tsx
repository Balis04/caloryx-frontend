import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-s6p5lk76jv2ydpek.us.auth0.com"
      clientId="pP4n4k7SZQXlKJutFIRBxx4VEdFhYdIV"
      authorizationParams={{
        redirect_uri: window.location.origin + "/auth-redirect",
        audience: "https://caloriex-api",
        scope: "openid profile email offline_access",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
