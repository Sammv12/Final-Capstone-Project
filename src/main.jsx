import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import './index.css'
import Dashboard from './pages/Dashboard.jsx';
import Checkin from './pages/Checkin.jsx';
import Checkout from './pages/Checkout.jsx';
import Logs from './pages/Logs.jsx';
import Add from './pages/Add.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminAdd from './pages/admin/AdminAdd.jsx';
import ManageUser from './pages/admin/ManageUser.jsx';
import AllLogs from './pages/admin/AllLogs.jsx';
import OutCameras from './pages/admin/OutCameras.jsx';
import Login from './pages/Login.jsx';
import EquipmentData from './pages/admin/EquipmentData.jsx';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute.jsx';
import ErrorPage from './pages/error-page.jsx';

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Navigate to='/login' />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/dashboard",
    element: <StudentRoute element={<Dashboard />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/checkin",
    element: <StudentRoute element={<Checkin />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/checkout",
    element: <StudentRoute element={<Checkout />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/logs",
    element: <StudentRoute element={<Logs />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/add",
    element: <StudentRoute element={<Add />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminRoute element={<AdminDashboard />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/add",
    element: <AdminRoute element={<AdminAdd />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/manageuser",
    element: <AdminRoute element={<ManageUser />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/alllogs",
    element: <AdminRoute element={<AllLogs />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/camerasout",
    element: <AdminRoute element={<OutCameras />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/equipment",
    element: <AdminRoute element={<EquipmentData />} />,
    errorElement: <ErrorPage />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
      <RouterProvider router={router} />
   
  </React.StrictMode>
)
