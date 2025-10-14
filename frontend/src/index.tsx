import { Auth0Provider } from "@auth0/auth0-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CategoryProvider } from "./context/CategoryContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    authorizationParams={{
      redirect_uri: window.location.origin + "/callback",
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    }}
  >
    <CategoryProvider>
      <App />
    </CategoryProvider>
  </Auth0Provider>
);
