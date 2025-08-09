import { createContext, useContext, ReactNode } from "react";
import { orderApi } from "../api/orderApi";
import type { ItemOrder } from "../api/orderApi";

interface OrderContextType {
  placeOrder: (items: ItemOrder[], totalPrice: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {

    const placeOrder = async(items: ItemOrder[], totalPrice: number) =>{
        await orderApi.createOrder({items,totalPrice})
    }

  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
}