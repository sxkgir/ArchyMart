import { useEffect,useState } from "react";
import { useUserContext } from "../contexts/UserProvider"
import { Navigate } from "react-router-dom";
import LoadingScreen from "../Components/UI/LoadingScreen";


export default function AuthRoute({children} : {children : React.ReactElement}) {

    const {checkAuth, isLoggedIn} = useUserContext();

    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        async function checkAuthentication() {
        await checkAuth();
        setAuthChecked(true);
        }
        checkAuthentication();
    }, [checkAuth]);


    if (!authChecked){
        return <LoadingScreen />
    }

    return(
        isLoggedIn ? <Navigate to="/home" replace={true} />: <>{children}</> 
    )
}