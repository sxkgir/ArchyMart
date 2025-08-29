import type { Order } from "../../Types/Order"
import type { StaffViewOrder } from "../../Types/Order"
import { useOrderContext } from "../../contexts/OrderProvider"
import Load from "../../assets/Load.svg?react"
import MessageModal from "./MessageModal"
import { act, useState } from "react"

type DetailedUserOrderProp ={
    order : Order | StaffViewOrder;
    onClose: () => void;
    viewedBy: string;
}



export default function DetailedUserOrder({order, onClose, viewedBy} : DetailedUserOrderProp){
    const {handleOrderDecision, message} = useOrderContext();
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    


    const handleSubmit = async(action: "confirmed" | "denied" | "pick-up" | "student-accepted" | "canceled") =>{
    try{
        setIsSubmitting(true);
        await handleOrderDecision(order.orderID,action);
    }
    catch(err){
        setShowModal(true);
        setIsSubmitting(false);

        console.log(err);
    }
    finally{
        setShowModal(true);
        setIsSubmitting(false);
    }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-[600px] max-h-[80vh] flex flex-col p-6 relative">
                <div className="border-b relative flex justify-between items-center">
                    <h2 className="text-2xl font-bold pb-3">Order Details</h2>
                    <button
                        className="text-gray-500 hover:text-black text-xl"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto pt-6">
                    <p><strong>Order-ID:</strong> {order.orderID}</p>
                    {viewedBy === "staff" && typeof order.orderedBy === "object" &&
                        <div>
                            <p><strong>Ordered By:</strong> {order.orderedBy.lastName} {order.orderedBy.firstName}</p>
                            <p><strong>Email:</strong> {order.orderedBy.email}</p>
                        </div>
                    }
                    <p><strong>Date Placed:</strong> {new Date(order.datePlaced).toLocaleString()}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>

                    <h3 className="mt-6 pt-4 border-t border-gray-300 text-lg font-semibold ">
                    Items
                    </h3>

                    <ul className="mt-2 space-y-2">
                    {order.items.map((item, idx) => (
                        <li key={idx} className="border-b pb-2">
                        <p className="font-medium"> <b>Product Name: </b>{item.productName}</p>
                        <p> <b>Category: </b>{item.category}</p>
                        <p> <b>Qty: </b>{item.qty}</p>
                        <p> <b>Total: </b> ${item.totalPrice.toFixed(2)}</p>
                        </li>
                    ))}
                    </ul>
                </div>
                {viewedBy === "student" && order.status === "awaiting-student" && (
                    <div className="relative mt-6 pb-6 pt-4 px-[10%]">
                        <div className="flex justify-between gap-[10%]">
                            <button
                                className={`
                                border transition rounded-2xl w-[50%] py-2
                                ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:bg-green-800"}
                                `}
                                disabled={isSubmitting}
                                onClick={() => handleSubmit("student-accepted")}
                            >
                                Accept
                                
                            </button>
                            <button
                                className={`
                                border transition rounded-2xl w-[50%] py-2
                                ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 active:bg-red-800"}
                                `}
                                disabled={isSubmitting}
                                onClick={() => handleSubmit("canceled")}
                            >
                                Cancel
                            </button>
                        </div>      
                    </div>          
                )}
                {viewedBy === "student" && order.status !== "awaiting-student" && (
                    <div className="flex justify-center mt-6 pb-6 pt-4 px-[10%]">
                            <button
                                className={`
                                border transition rounded-2xl w-[50%] py-2
                                ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 active:bg-red-800"}
                                `}
                                disabled={isSubmitting}
                                onClick={() => handleSubmit("canceled")}
                            >
                                Cancel
                            </button>
                    </div>      
                          
                )}

                {viewedBy === "staff" && typeof order.orderedBy === "object" && (
                <div className="relative mt-6 pb-6 pt-4 px-[10%]">
                    {/* Button row */}
                    <div className="flex justify-between gap-[10%]">
                        <button
                            className={`
                            border transition rounded-2xl w-[50%] py-2
                            ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:bg-green-800"}
                            `}
                            disabled={isSubmitting}
                            onClick={() => handleSubmit("confirmed")}
                        >
                            Confirm
                        </button>

                        <button
                            className={`
                            border transition rounded-2xl w-[50%] py-2
                            ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-600 active:bg-blue-800"}
                            `}
                            disabled={isSubmitting}
                            onClick={() => handleSubmit("pick-up")}
                        >
                            Ready to Pick Up
                        </button>

                        <button
                            className={`
                            border transition rounded-2xl w-[50%] py-2
                            ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 active:bg-red-800"}
                            `}
                            disabled={isSubmitting}
                            onClick={() => handleSubmit("denied")}
                        >
                            Deny
                        </button>
                    </div>

                    {/* Overlay loader covering both buttons */}
                    {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl z-10">
                        <Load className="w-8 h-8 animate-spin" />
                    </div>
                    )}
                </div>
                )}

            </div>
            {showModal && (
            <MessageModal message={message} onClose={() => {setShowModal(false);}} />
            )}
        </div>
    )

}