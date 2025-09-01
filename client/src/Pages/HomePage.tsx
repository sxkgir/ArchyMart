import { useState } from "react";
import LeftSideBar from "../Components/Sidebar";
import OrderContent from "../Components/Order";
import UserOrders from "../Components/UserOrders";
import ManageOrders from "../Components/ManageOrders";
import Profile from "../Components/Profile";
import StaffProductsTable from "../Components/ProductsTable";

export function HomePage() {
  const [selectedSection, setSelectedSection] = useState("welcome");
  const [mobileOpen, setMobileOpen] = useState(false); // ⟵ NEW

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
        return <Profile />;
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
      {/* Desktop sidebar unchanged; hidden on mobile */}
      <aside className="hidden md:block shrink-0 w-56 md:w-64 lg:w-72 border-r border-black/5 bg-white">
        <LeftSideBar onSelectSection={setSelectedSection} />
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header: add hamburger on mobile only; desktop unchanged */}
        <header className="top-0 z-10 h-20 flex items-center bg-[#f4f4f461] text-[#484848c3] font-bold px-4 md:px-6">
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            className="md:hidden mr-3 inline-flex items-center justify-center rounded-md p-2 border border-black/10"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            {/* simple hamburger icon */}
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-lg md:text-xl bg-[#f4f4f461]">{title}</h1>
        </header>

        {/* Mobile slide-in menu */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            {/* Panel */}
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl">
              {/* Close button */}
              <div className="flex items-center justify-between px-3 py-3 border-b">
                <span className="font-semibold">Menu</span>
                <button
                  type="button"
                  className="rounded-md p-2 border border-black/10"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>

              {/* Reuse your existing sidebar content; close menu when selecting */}
              <div className="h-[calc(100%-49px)] overflow-y-auto">
                <LeftSideBar
                  onSelectSection={(s) => {
                    setSelectedSection(s);
                    setMobileOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <section className="flex-1 overflow-y-auto bg-[#ffffff]">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-4 ">{renderContent()}</div>
        </section>
      </main>
    </div>
  );
}
