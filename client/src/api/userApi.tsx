import axios from "axios";
import type { studentLogin } from "../Types/Credentials";
const axiosInstance = axios.create({
    baseURL: "",
    withCredentials: true
    
}); 



export const userApi = {


    
    LogInStudent : async(student: studentLogin) =>{
        try{
            const response = (await axiosInstance.post("/api/auth/student",student)).data
            return response;

        }
        catch(error){
            throw error;
        }

    },

    LogInStaff : async(staffEmail: string) =>{
        try{
            const response = (await axiosInstance.post("/api/auth/staff",{email : staffEmail})).data
            return response;
        }
        catch(error){
            throw error;
        }
    },


    checkAuth : async() => {
        try{
            const response = (await axiosInstance.get("/api/auth/status")).data
            return response;

        }
        catch(error){
            console.log("Error in finding session:",error);
            throw error

        }
    },

    logOut: async() => {
        try{
            const response = (await axiosInstance.post("/api/auth/logout")).data
            return response;
        }
        catch(error){
            console.log("Error in finding session:",error);
            throw error

        }
    }

    
}