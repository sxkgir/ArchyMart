import axios from "axios";
import qs from "qs"
import type { Status } from "../Types/Order";
import type { CreateOrderDTO } from "../Types/Order";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});




export const orderApi = {

    createOrder : async(orderData : CreateOrderDTO,studentRIN : number, formID: string | "" ) => {
        const response = (await axiosInstance.post("/api/orders/create",{orderData, studentRIN, formID})).data
        return response
    },

    getMyOrders : async( q: string | "",page: number, status: Status[] | null, formID: string | null) =>{
        const response = (await axiosInstance.get("/api/orders/my",{
        params: {q, page, status},
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
        // produces: ?status=pending&status=confirmed
      })).data
      return response;
    },
    
    //only staff can access
    getAllOrders : async(q: string | "", page: number, status: Status[] | null, formID: string | null) => {
      const response = (await axiosInstance.get("/api/orders/all", {
        params: {q, page, status},
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
        // produces: ?status=pending&status=confirmed
      })).data
      return response;
    },

    handleOrderDecision : async(orderID : string, action: "confirmed" | "denied" | "pick-up" | "student-accepted" | "canceled") =>{
      const response = (await axiosInstance.post(`/api/orders/${orderID}/decision`, {action})).data
      return response;
    },

    getWeeklyReport : async() =>{
      const response = (await axiosInstance.get('/api/orders/week/report')).data
      return response;
    }


}