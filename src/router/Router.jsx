import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout';
import DJProfilePage from '../Pages/DJProfilePage';
import DJDashboard from '../Components/Main/DJpages/DJDashboard';
import HomePage from '../Pages/HomePage';
import LoginPage from '../Pages/LoginPage';
import ServicesPage from '../Pages/ServicesPage';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "dj/:id",
                element: <DJProfilePage />
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/services",
                element: <ServicesPage />
            },
            {
                path: "dj-dashboard",
                element: <DJDashboard />
            },
        ],
    },
]);