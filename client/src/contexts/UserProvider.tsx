import { createContext, useContext, useEffect, useState, ReactNode,Dispatch, SetStateAction } from "react";
import { userApi } from "../api/userApi";
interface UserContextType{
    checkAuthType : () => Promise<String>
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children} : {children : ReactNode}){
    const checkAuthType = async() =>{
        try{
            return "test"

        }
        catch(err){
            return "test"
        }

    }


    return(
        <UserContext.Provider value={{
            checkAuthType,
        }}
        >
    
        </UserContext.Provider>
    )

}

export function useProductContext(){
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context; 
}
