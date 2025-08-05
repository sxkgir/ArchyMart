import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",  
    withCredentials: true
}); 

export interface studentLogin{
    email : string;
    RIN : number;
}

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
    }

    
}