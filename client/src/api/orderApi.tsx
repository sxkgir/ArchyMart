import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

export interface ItemOrder {
  productID: string;
  productName: string;
  category:string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderDTO{
    items: ItemOrder[];
    totalPrice: number;
}

export const orderApi = {

    createOrder : async(orderData : CreateOrderDTO) => {
        const response = (await axiosInstance.post("/api/orders/create",orderData)).data
        return response
    },

    getMyOrders : async() =>{
        const response = (await axiosInstance.get("/api/orders/my")).data
        return response;
    }
    



}