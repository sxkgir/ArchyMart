import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserProvider"
import { Navigate } from "react-router-dom";
import LoadingScreen from "../Components/UI/LoadingScreen";

export default function ProtectedRoute({children} : {children : React.ReactElement}) {
    const { isLoggedIn,checkAuth } = useUserContext();
    const [authChecked, setAuthChecked] = useState(false);

    
    useEffect(() => {
        async function checkAuthentication(){
            await checkAuth()
            setAuthChecked(true);
        }checkAuthentication();
    },[isLoggedIn])

    //it takes time for auth to be checked so it will return to children even if auth is checked. Make it wait on a div.
    if (!authChecked) {
        return <LoadingScreen/>
    }


    return(
        isLoggedIn ? <>{children}</> : <Navigate to="/" replace={true} />
    )
}