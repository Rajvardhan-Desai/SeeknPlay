import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage/AuthPage";
import FindNearbyPage from "../pages/FindNearByPage/FindNearByPage";
import HomePage from "../pages/HomePage/HomePage"
import ProfiePage from "../pages/ProfilePage/ProfilePage"

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/FindNearBy",
    element: <FindNearbyPage />,
  }
]);
