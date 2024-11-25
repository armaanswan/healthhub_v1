import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider, USER_ROLE } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users";
import dataProvider from "./dataProvider";
import RegisterPatient from "./pages/register-patient";
import { accessControlProvider } from "./accessControlProvider";
import { PatientEdit, PatientList, PatientShow } from "./pages/patients";
import { TestResultList } from "./pages/test-results/list";
import { TestResultCreate } from "./pages/test-results/create";
import { TestResultEdit } from "./pages/test-results/edit";
import { TestResultShow } from "./pages/test-results/show";

function NavigateToResourceByRole() {
  const role = localStorage.getItem(USER_ROLE) || "";
  if (role === "Doctor" || role === "Staff") {
    return <NavigateToResource resource="patients" />;
  } else if (role === "Patient") {
    return <NavigateToResource resource="test-results" />;
  }
  return <NavigateToResource resource="users" />;
}

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                dataProvider={dataProvider}
                accessControlProvider={accessControlProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "patients",
                    list: "/patients",
                    edit: "/patients/edit/:id",
                    show: "/patients/show/:id",
                  },
                  {
                    name: "test-results",
                    list: "/test-results",
                    create: "/test-results/create",
                    edit: "/test-results/edit/:id",
                    show: "/test-results/show/:id",
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "iVJXP8-kHRCJD-BYaeSG",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Title={() => (
                            <ThemedTitleV2
                              text="HealthHub"
                              // icon={<img src="https://refine.dev/img/logo.png" />}
                              collapsed={false}
                            />
                          )}
                          Header={Header}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route index element={<NavigateToResourceByRole />} />

                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>
                    <Route path="/patients">
                      <Route index element={<PatientList />} />
                      <Route path="edit/:id" element={<PatientEdit />} />
                      <Route path="show/:id" element={<PatientShow />} />
                    </Route>
                    <Route path="/test-results">
                      <Route index element={<TestResultList />} />
                      <Route path="create" element={<TestResultCreate />} />
                      <Route path="edit/:id" element={<TestResultEdit />} />
                      <Route path="show/:id" element={<TestResultShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/register-patient"
                      element={<RegisterPatient />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
