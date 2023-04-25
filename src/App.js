import React, { useEffect, useState } from "react";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { InteractionStatus, EventType } from "@azure/msal-browser";
import { msalConfig, loginRequest, graphConfig } from "./authConfig";
import "./App.css";

function App() {
  const { instance, accounts, inProgress } = useMsal();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const request = {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${accounts[0].idToken}`,
        }),
      };
      fetch(graphConfig.graphMeEndpoint, request)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          setPhoto(URL.createObjectURL(blob));
        })
        .catch((error) => {
          console.error("Error fetching photo", error);
        });
    }
  }, [accounts]);

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((error) => {
      console.error("Error logging in", error);
    });
  };

  const handleLogout = () => {
    instance.logout();
  };

  return (
    <div className="App">
      <header className="App-header">
        {inProgress === InteractionStatus.None && (
          <>
            {!accounts[0] ? (
              <button onClick={handleLogin}>Sign in</button>
            ) : (
              <>
                <img src={photo} alt="Profile" />
                <button onClick={handleLogout}>Sign out</button>
              </>
            )}
          </>
        )}
        {inProgress !== InteractionStatus.None && <p>Loading...</p>}
      </header>
    </div>
  );
}

function AuthProvider({ children }) {
  const { instance } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise().catch((error) => {
      console.error("Error handling redirect", error);
    });
  }, [instance]);

  useEffect(() => {
    instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log("Login success");
      }
      if (event.eventType === EventType.LOGIN_FAILURE) {
        console.error("Login failure", event.error);
      }
    });
  }, [instance]);

  return <MsalProvider instance={instance}>{children}</MsalProvider>;
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;