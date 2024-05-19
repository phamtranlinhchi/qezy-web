import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { msalConfig } from './helpers/azureConfig';
import PrivateComponent from './components/PrivateComponent';
import Welcome from './components/Welcome';
import { ConfirmProvider } from 'material-ui-confirm';
import { Exams } from "./components/Exams";
import { Questions } from "./components/Questions";
import { Users } from "./components/Users";
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
                  <Exams />
                </PrivateComponent>
              }
            />
            <Route path="/welcome" element={<Welcome />} />
            <Route
              path="/exams"
              element={
                <PrivateComponent>
                  <Exams />
                </PrivateComponent>
              }
            />

            <Route
              path="/questions"
              element={
                <PrivateComponent protect>
                  <Questions />
                </PrivateComponent>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateComponent protect>
                  <Users />
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
