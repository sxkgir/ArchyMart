import { Children } from "react"
import App from "../App"
import { HomePage } from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import StudentLoginPage from "../Pages/StudentLoginPage";
import StaffLoginPage from "../Pages/StaffLoginPage";
import AuthRoute from "../Auth/AuthRoute";
import ProtectedRoute from "../Auth/ProtectedRoute";
const routes = [
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "/",
                
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/login",
                element: (
                    <AuthRoute>
                        <LoginPage />
                    </AuthRoute>
                )
            },
            {
                path:"/login/student",
                element:(
                    <AuthRoute>
                        <StudentLoginPage />
                    </AuthRoute>

                )
            },
            {
                path:"/login/staff",
                element:(
                    <AuthRoute>
                        <StaffLoginPage />
                    </AuthRoute>

                )                
            }
        ]
    }
]

export default routes;