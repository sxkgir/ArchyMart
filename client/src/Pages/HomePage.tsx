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

  const title =
    {
      welcome: "Home",
      order: "Order",
      yourOrders: "Your Orders",
      manageOrder: "Manage Orders",
      products: "Manage Products",
      profile: "My Profile",
      polls: "Polls",
      contact: "Contact",
    }[selectedSection] ?? "";

  return (
    <div className="flex min-h-screen w-full bg-[#efefef]">
      <aside className="shrink-0 w-56 md:w-64 lg:w-72 border-r border-black/5 bg-white">
        <LeftSideBar onSelectSection={setSelectedSection} />
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="top-0 z-10 h-20 flex items-center bg-[#f4f4f461] text-[#484848c3] font-bold px-4 md:px-6">
          <h1 className="text-lg md:text-xl bg-[#f4f4f461]">{title}</h1>
        </header>

        <section className="flex-1 overflow-y-auto bg-[#ffffff]">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-4 ">
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  );
}