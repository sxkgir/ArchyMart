import { Children } from "react"
import App from "../App"
import { HomePage } from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import StudentLoginPage from "../Pages/StudentLoginPage";

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
            },
            {
                path:"/login/student",
                element: <StudentLoginPage />
            }
        ]
    }
]

export default routes;