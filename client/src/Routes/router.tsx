import { Children } from "react"
import App from "../App"
import { HomePage } from "../Pages/HomePage";

const routes = [
    {
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
        ]
    }
]

export default routes;