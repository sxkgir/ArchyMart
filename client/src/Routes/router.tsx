import { Children } from "react"
import App from "../App"
import { HomePage } from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";

const routes = [
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/login",
                element: <LoginPage />

            }
        ]
    }
]

export default routes;