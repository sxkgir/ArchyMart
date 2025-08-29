export interface ItemOrder {
  productID: string;
  productName: string;
  category:string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}
export type Status = "pending" | "confirmed" | "denied" | "pick-up" | "student-accepted" | "awaiting-student" | "canceled";

export interface CreateOrderDTO{
    items: ItemOrder[];
    totalPrice: number;
}

export interface Order {
    orderID: string;
    orderedBy: string;
    items: ItemOrder[];
    totalPrice: number;
    status: string;
    datePlaced: string;
    confirmedDate?: string;
}

export interface PageData{
    orders: Order[];
    page: number;
    total: number;
    totalPages: number;
    message: string;
}

export interface StaffViewOrder extends Omit<Order, "orderedBy"> {
    orderedBy: {
        _id: string;
        firstName:string;
        lastName: string;
        email: string;
    }
}

export interface StaffPageData extends Omit<PageData, "orders"> {
    orders : StaffViewOrder[];
}
