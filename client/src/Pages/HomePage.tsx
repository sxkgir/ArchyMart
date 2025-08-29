import { useState } from "react";
import { Link } from "react-router-dom";
import  LeftSideBar  from "../Components/Sidebar";
import  OrderContent  from "../Components/Order";
import  UserOrders  from "../Components/UserOrders";
import  ManageOrders  from "../Components/ManageOrders";
import  Profile  from "../Components/Profile";
import StaffProductsTable from "../Components/ProductsTable";
export function HomePage() {
    const [selectedSection, setSelectedSection] = useState("welcome");

    const renderContent = () => {
        switch (selectedSection) {
        case "order":
            return <OrderContent />;
        case "yourOrders":
            return <UserOrders />;
        case "manageOrder":
            return <ManageOrders />;
        case "products":
            return <StaffProductsTable />;
        case "profile":
            return <Profile />
        case "polls":
            return <div className="text-xl font-bold p-6">Polls and feedback</div>;
        case "contact":
            return <div className="text-xl font-bold p-6">Contact the staff</div>;
        default:
            return <div className="text-3xl font-bold p-6">Welcome to ArchyMart!</div>;
        }
    };

    return(
    <>
        <div className="flex">
            <div className="lg:max-w-[270px] md:max-w-[200px] sm:max-w-[150px]">
                <LeftSideBar onSelectSection={setSelectedSection}/>
            </div>
            <div className="flex flex-col w-[100%] h-screen">
                <div className="flex items-center h-[80px] bg-[#f4f4f461] w-[100%] pl-[2.5%] text-[#484848c3] text-[20px] font-bold">
                    {{
                    welcome: "Home",
                    order: "Order",
                    yourOrders: "Your Orders",
                    manageOrder: "Manage Orders",
                    products: "Manage Products",
                    profile: "My Profile",
                    polls: "Polls",
                    contact: "Contact",

                    }[selectedSection] ?? ""}
                </div>
                <div className="bg-[#efefef] h-[calc(100%-(80px))] p-[2%]">
                    <div className={""}>
                        {renderContent()}
                    </div>
                        
                </div>

            </div>
        </div>
    </>
    )
}
