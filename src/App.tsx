import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { msalConfig } from './helpers/azureConfig';
import PrivateComponent from './components/PrivateComponent';
import Welcome from './components/Welcome';
import { ConfirmProvider } from 'material-ui-confirm';
import Home from './components/Home';
import PermissionsPage from './components/permissons/PermissionsPage';
function App() {
  const msalInstance = new PublicClientApplication(msalConfig);
  return (
    <MsalProvider instance={msalInstance}>
      <ConfirmProvider>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <PrivateComponent>
                  <Home />
                </PrivateComponent>
              }
            />
            <Route path="/welcome" element={<Welcome />} />
            <Route
              path="/permissions"
              element={
                <PrivateComponent protect>
                  <PermissionsPage />
                </PrivateComponent>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ConfirmProvider>
    </MsalProvider>
  );
}

export default App;
