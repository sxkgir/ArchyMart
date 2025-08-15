import { useEffect,useState } from "react"
import type { ItemOrder } from "../api/orderApi"

export interface Order {
    orderID: string;
    orderdBy: string;
    items: ItemOrder[];
    totalPrice: number;
    confirmed: boolean;
    datePlaced: string;
    confirmedDate?: string;
}

interface PageData{
    orders: Order[];
    page: number;
    limit: number;
    toatal: number;
    totalPgaes: number;
}

export function UserOrders(){
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 20;

    return(
        <div className="bg-[#ffffff] rounded-2xl p-4 h-full">
            <p className="text-2xl font-bold mb-8 font-mono ">My Orders</p>
            <div className="flex pl-[2%] font-serif font-extrabold text-[12px]">
                <p className="basis-[25%]">Order ID</p>

                <p className="basis-[15%]">Date Placed</p>

                <p className="basis-[20%]">Number of Items</p>

                <p className="basis-[20%]">Total Price</p>

                <p className="basis-[10%]">Status</p>
            </div>
            <div className="flex flex-col">
                <div className="bg-[#efefef] rounded-2xl pl-[2%] basis-[8.3%]">
                    Testing
                </div>

            </div>


        </div>
    )
}