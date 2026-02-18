import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout';
import DJProfilePage from '../Pages/DJProfilePage';
import DJDashboard from '../Components/Main/DJpages/DJDashboard/DJDashboard';
import HomePage from '../Pages/HomePage';
import LoginPage from '../Pages/LoginPage';
import ServicesPage from '../Pages/ServicesPage';
import UserProfilePage from '../Pages/UserProfilePage';
import { SafeRoute } from '../auth/Role';
import CardPage from '../Pages/CardPage';
import BookingPage from '../Pages/BookingPage';


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
                // path: "dj/:id",
                path: "/djprofile",
                element:
                    <SafeRoute allow="dj">
                        <DJProfilePage />
                    </SafeRoute>
            },
            {
                path: "/profile",
                element:
                    <SafeRoute allow="user">
                        <UserProfilePage />
                    </SafeRoute>
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
                element:
                    <SafeRoute allow="dj">
                        <DJDashboard />
                    </SafeRoute>
            },
            {
                path: "/cards",
                element: <CardPage />
            },
            {
                path: "/new-booking",
                element:
                    <SafeRoute allow="user">
                        <BookingPage />
                    </SafeRoute>
            },
        ],
    },
]);