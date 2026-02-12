import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout';
import DJProfilePage from '../Pages/DJProfilePage';
import DJDashboard from '../Components/Main/DJpages/DJDashboard';
import HomePage from '../Pages/HomePage';


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
                path: "dj-dashboard",
                element: <DJDashboard />
            },
        ],
    },
]);