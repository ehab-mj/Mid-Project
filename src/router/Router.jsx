import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout';


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
                element: <DjProfilePage />
            },
            {
                path: "dj-dashboard",
                element: <DJDashboardPage />
            },
            // {
            //     path: "*",
            //     element: NotFound
            // },
        ],
    },
]);