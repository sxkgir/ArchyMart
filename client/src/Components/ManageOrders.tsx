import { useEffect,useState } from "react"
import type { Order } from "../Types/Order";
import type { PageData } from "../Types/Order";
import type { Status } from "../Types/Order";
import { useOrderContext } from "../contexts/OrderProvider";
import DetailedUserOrder from "./UI/DetailedUserOrder";
import SearchAndFilter from "./SearchAndFilter";
import MessageModal from "./UI/MessageModal";
import Download from "../assets/Download.svg?react"
import type { StaffPageData } from "../Types/Order";
import type { StaffViewOrder } from "../Types/Order";


export default function ManageOrders() {
    const { getAllOrders, getWeeklyReport}  = useOrderContext();
    const [data, setData] = useState<StaffPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("")
    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const [statuses, setStatuses] = useState<Status[]>([]);   // ← add this
    const [selectedOrder, setSelectedOrder] = useState<StaffViewOrder | null>(null);


    useEffect(() => {
        let isActive = true;
        (async () => {
        try {
            setLoading(true);
            // If your context supports params: getAllOrders({ page, q })
            const response = await getAllOrders(q, page, statuses); 
            
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
    }, [page, q, statuses,getAllOrders]); // <-- refetch when page OR q changes

    const handleSearchSubmit = (value: string) => {
        setPage(1);     // reset pagination on new search
        setQ(value);    // triggers useEffect → refetch
    };

    const handleStatusChange = (next: Status[]) => {   
        setPage(1);
        setStatuses(next);      
    };

    useEffect(() =>{

        if(data?.message !== "" && data?.message){
            setMessage(data.message);
            setShowModal(true);
        }
    },[data])

    const downloadWeeklyReport = async() =>{
        try {
            // If your API returns { report: string }
            const { report } = await getWeeklyReport();

            const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
            const url  = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `arch_materials_chgs_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    }
    

    return(
        <div className="bg-[#ffffff] rounded-2xl  p-4 max-w-[90%] mx-auto shadow-md font-[Inter]">
            <p className="text-2xl font-bold mb-8 ">Students Orders</p>
                <div className="flex gap-[5%] pb-[2.5%] justify-center">
                    <SearchAndFilter defaultSearchValue={q} onSubmit={handleSearchSubmit} 
                                     selectedStatuses={statuses} onStatusChange={handleStatusChange} role="staff" />
                    <button 
                        className="px-[2%] py-1.5 bg-[#005DE9] text-white rounded-[9px] font-[Inter] text-[14px] flex flex-row-reverse items-center gap-2 hover:cursor-pointer"
                        onClick={() => downloadWeeklyReport()}
                    >
                        <Download className="w-7 h-7 fill-white "/>
                        Download
                    </button>

                </div>

            <div className="flex pl-[2%]  font-extrabold text-[13px]">
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
                            statusText = "Pick Up"
                        }
                        else if (order.status === "awaiting-student"){
                            statusClasses += "bg-yellow-600";
                            statusText = "Awaiting Student Action";
                        }
                        else if (order.status === "student-accepted"){
                            statusClasses += "bg-yellow-600";
                            statusText = "AWAITING STAFF ACTION!";
                        }
                        else if (order.status === "canceled"){
                            statusClasses += "bg-red-500";
                            statusText = "Canceled by Student"
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
                    viewedBy={"staff"}
                />
            )}
            {showModal && <MessageModal message={message} onClose={() => setShowModal(false)}/>}
        </div>
    )





}