import { useEffect,useState } from "react"
import type { PageData } from "../Types/Order";
import type { Status } from "../Types/Order";
import type { Order } from "../Types/Order";
import { useOrderContext } from "../contexts/OrderProvider";
import DetailedUserOrder from "./UI/DetailedUserOrder";
import SearchAndFilter from "./SearchAndFilter";



export default function UserOrders(){
    const {getMyOrders} = useOrderContext();
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statuses, setStatuses] = useState<Status[]>([]);   // ← add this
    
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [q,setQ] = useState("");

    const handleSearchSubmit = (value : string ) => {
        setPage(1);    
        setQ(value);    
    }

    const handleStatusChange = (next: Status[]) => {   
        setPage(1);
        setStatuses(next);      
    };


    useEffect(() => {
        let isActive = true;
        (async () => {
        try {
            setLoading(true);
            // If your context supports params: getAllOrders({ page, q })
            const response = await getMyOrders(q, page, statuses, null);
            
            if (!isActive) return; // guard for update state on an unmounted component (or one whose effect has been replaced by a newer one).
            setData(response);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            if (!isActive) return;
            setData({ orders: [], page, total: 0, totalPages: 1 , message: "Server Error"});
        } finally {
            if (isActive) {
                setLoading(false)
            };
        }
        })();
        return () => { isActive = false; }; // if it another new request is made before isActive is flase and is in useEffect it will return with the guards.
    }, [page, q, statuses,getMyOrders]); // <-- refetch when page OR q changes


    return(
        <div className="bg-[#ffffff] rounded-2xl p-4 max-w-[90%] mx-auto shadow-md">
            <p className="text-2xl font-bold mb-8 font-mono ">My Orders</p>
            <SearchAndFilter defaultSearchValue={q} onSubmit={handleSearchSubmit} 
                             selectedStatuses={statuses} onStatusChange={handleStatusChange} role="student" />
            <div className="flex pl-[2%] font-serif font-extrabold text-[13px]">
                <p className="basis-[25%]">Order ID</p>

                <p className="basis-[15%]">Date Placed</p>

                <p className="basis-[20%]">Number of Items</p>

                <p className="basis-[17%]">Total Price</p>

                <p className="basis-[10%]">Status</p>
            </div>
            <div className="flex flex-col">
                <div className="bg-[#efefef] rounded-2xl pl-[2%] basis-[8.3%] ">
                    {loading && <p>Loading your orders...</p>}
                    {!loading && data?.orders.length === 0 && <p>No orders found.</p>}

                    {!loading && data && data.orders.map((order) => {
                        let statusClasses =
                        "px-2 py-1 rounded-full text-white text-xs font-semibold ";

                        let statusText = "";

                        if (order.status === "pending") {
                            statusClasses += "bg-yellow-400"; // Pending
                            statusText = "Pending";

                        } else if (order.status === "confirmed") {
                            statusClasses += "bg-green-500"; // Confirmed
                            statusText = "Confirmed";

                        }else if (order.status === "denied") {
                            statusClasses += "bg-red-500";
                            statusText = "Denied";
                        }
                        else if (order.status === "pick-up"){
                            statusClasses += "bg-blue-400"
                            statusText = "Pick Up";
                        }
                        else if (order.status === "awaiting-student"){
                            statusClasses += "bg-yellow-600";
                            statusText = "AWAITING STUDENT ACTION!";
                        }
                        else if (order.status === "student-accepted") {
                            statusClasses += "bg-yellow-600";
                            statusText = "Awaiting Staff Action";
                        }
                        else if (order.status === "canceled") {
                            statusClasses += "bg-red-500";
                            statusText = "Canceled By You";
                        }
                    return(
                        <div key={order.orderID} className="bg-[#efefef] rounded-2xl flex items-center py-2 my-2 text-[14px] font-bold">
                            <p className="basis-[20%] truncate pr-2 mr-[5%]">{order.orderID}</p>
                            <p className="basis-[15%]">{new Date(order.datePlaced).toLocaleDateString()}</p>
                            <p className="basis-[20%]">{order.items.length}</p>
                            <p className="basis-[8%]">${order.totalPrice.toFixed(2)}</p>
                            <p className="basis-[22%] flex justify-center">
                                <span className={statusClasses}>
                                    {statusText}
                                </span>
                            </p>
                            <p 
                                className="text-[#080a9e] hover:text-blue-800 cursor-pointer text-sm"
                                onClick={() => setSelectedOrder(order)}
                            >
                                &gt; View Action
                            </p>                            
                        </div>

                    )
                    

                    })}               
                </div>

            </div>
            <div className="mt-4 flex gap-2 items-center justify-end">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50 rounded-2xl"
                >
                    Prev
                </button>
                <span>Page {data?.page} of {data?.totalPages}</span>
                <button
                    disabled={data !== null && page >= data.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50 rounded-2xl"
                >
                    Next
                </button>
            </div>

            {selectedOrder && (
                <DetailedUserOrder
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    viewedBy="student"
                />
            )}

        </div>
    )
}