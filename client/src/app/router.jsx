import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";

// Create a wrapper component to include AuthProvider
const AppWithAuth = () => (
  <AuthProvider>
    {routes}
  </AuthProvider>
);

// Create router with the wrapped routes
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWithAuth />,
    children: routes
  }
]);











