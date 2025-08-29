import { createContext, useContext, ReactNode } from "react";
import { orderApi } from "../api/orderApi";
import type { ItemOrder } from "../Types/Order";
import type { Status } from "../Types/Order";
import { useState } from "react";

interface OrderContextType {
  placeOrder: (items: ItemOrder[], totalPrice: number, studentRIN: number, formID: string | "") => Promise<any>;
  getMyOrders: (q: string,page: number, status: Status[] | null, formID: string | null) => Promise<any>; 
  getAllOrders: (q: string | "", page: number, status: Status[] | null, formID: string | null) => Promise<any>; 
  handleOrderDecision: (orderID: string, action: "confirmed" | "denied" | "pick-up" | "student-accepted" | "canceled" ) => Promise<any>;
  getWeeklyReport: () => Promise<any>;
  message: string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {

    const [message, setMessage] = useState("");

    const placeOrder = async(items: ItemOrder[], totalPrice: number, studentRIN: number, formID: string | "") =>{
      try{
          const orderData = {
          items: items,
          totalPrice: totalPrice
        }
        const response = await orderApi.createOrder(orderData,studentRIN,formID)
        setMessage(response.message)

      }
      catch(err : any){
        console.log(err);
          const message = err?.response?.data?.message;
          setMessage(message || "Unexpected error occured, \nPlease contact jiangh8@rpi.edu");
      }

    }


    const getMyOrders = async (q:string, page: number, status: Status[] | null, formID: string | null) => {
      try{
        const response = await orderApi.getMyOrders(q,page,status,formID);
        console.log(response);
        return response
      }
      catch(err){
        console.log(err);
      }
    }

    const getAllOrders = async (q: string | "",page: number, status: Status[] | null, formID: string | null) => {
      try {
        const response = await orderApi.getAllOrders(q, page, status,formID);
          console.log(response);
          setMessage(response.message)
          return response
      }
        catch(err : any){
          console.log(err);
          const message = err?.response?.data?.message;
          setMessage(message || "Unexpected error occured, \nPlease contact jiangh8@rpi.edu");

        }
      }

    const handleOrderDecision = async (orderID: string, action: "confirmed" | "denied" | "pick-up" | "student-accepted" | "canceled") =>{
      try{
        const response = await orderApi.handleOrderDecision(orderID,action);
        setMessage(response.message)
        
      }
      catch(err : any){
        console.log(err);
        const message = err?.response?.data?.message;

        setMessage(message || "Unexpected error occured, \nPlease contact jiangh8@rpi.edu");
      }
    }

    const getWeeklyReport = async() =>{
      try{
        const response = await orderApi.getWeeklyReport();
        return response
      }
      catch(err: any){
        
      }
    }
      

      
  

  return (
    <OrderContext.Provider value={{ placeOrder, getMyOrders, getAllOrders, handleOrderDecision,message,getWeeklyReport }}>
      {children}
    </OrderContext.Provider>
  );
};

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
}