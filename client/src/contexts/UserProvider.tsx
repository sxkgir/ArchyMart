import { createContext, useContext, useEffect, useState, ReactNode,Dispatch, SetStateAction } from "react";
import { userApi } from "../api/userApi";
import type { studentLogin } from "../Types/Credentials";


interface UserContextType{
    LoginStudent : (student : studentLogin) => Promise<void>;
    LoginStaff : (staffEmail : string) => Promise<void>;
    checkAuth: () => Promise<any>
    isLoggedIn : boolean;
    role: string;
    errorMessage: string;
    setErrorMessage: Dispatch<SetStateAction<string>>
    isPolling: boolean;
    setIsPolling: Dispatch<SetStateAction<boolean>>;

}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children} : {children : ReactNode}){
    const [role, setRole] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isPolling, setIsPolling] = useState(false);



    const LoginStudent = async(student : {
        email: string;
        RIN: number;
    }) =>{
        try{
            const res = await userApi.LogInStudent(student);
            console.log("Found student");
                setIsLoggedIn(true);
                setRole("student");
                setErrorMessage("");
            
        }
        catch(err : any){
            console.log("Error Logging in student", err);
            const message = err?.response?.data?.message;
            if (message?.includes("Verification email sent")) {
                console.log("Trigger polling due to email verification step");
                setIsPolling(true); // <-- Trigger UI and polling
            }
            setErrorMessage(message || "An unexpected error occurred");
        }

    }

    const LoginStaff = async(staffEmail : string) =>{
        try{
            await userApi.LogInStaff(staffEmail);
            console.log("Found Staff");
            setIsLoggedIn(true);
            setRole("staff");
            setErrorMessage("");

        }
        catch(err:any){
            console.log("Error Logging in staff", err);
            const message = err?.response?.data?.message;

            if (message?.includes("Verification email sent")) {
                console.log("Trigger polling due to email verification step");
                setIsPolling(true); // <-- Trigger UI and polling
            }
            setErrorMessage(message || "An unexpected error occurred");
        }
    }



    
    const checkAuth = async() =>{
        try{
            const response = await userApi.checkAuth();
            console.log(response);
            if(response.LoggedIn){
                setIsLoggedIn(true);
                setRole(response.user.role)
                return response;
            }
            else{
                setIsLoggedIn(false);
            }

        }
        catch(err: any){
            console.error("Login failed:", err);
            setIsLoggedIn(false);
        }
    }


    return(
        <UserContext.Provider value={{
            LoginStudent,
            isLoggedIn,
            role,
            errorMessage,
            setErrorMessage,
            checkAuth,
            LoginStaff,
            isPolling,
            setIsPolling,

        }}
        >
            {children}
        </UserContext.Provider>
    )

}

export function useUserContext(){
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context; 
}
