import { useEffect, useState } from "react";
import type { PageData, Status, Order } from "../Types/Order";
import { useOrderContext } from "../contexts/OrderProvider";
import DetailedUserOrder from "./UI/DetailedUserOrder";
import SearchAndFilter from "./SearchAndFilter";

export default function UserOrders() {
  const { getMyOrders } = useOrderContext();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [q, setQ] = useState("");

  const handleSearchSubmit = (value: string) => {
    setPage(1);
    setQ(value);
  };

  const handleStatusChange = (next: Status[]) => {
    setPage(1);
    setStatuses(next);
  };

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        setLoading(true);
        const response = await getMyOrders(q, page, statuses, null);
        if (!isActive) return;
        setData(response);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (!isActive) return;
        setData({ orders: [], page, total: 0, totalPages: 1, message: "Server Error" });
      } finally {
        if (isActive) setLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [page, q, statuses, getMyOrders]);

  return (
    <div className="bg-white shadow-md rounded-xl max-w-full p-3 mx-auto md:rounded-2xl md:shadow-md md:max-w-[90%] md:p-4">
      <p className="text-xl font-bold mb-4 font-mono md:text-2xl md:mb-8">My Orders</p>

      <div className="mb-2 md:mb-4">
        <SearchAndFilter
          defaultSearchValue={q}
          onSubmit={handleSearchSubmit}
          selectedStatuses={statuses}
          onStatusChange={handleStatusChange}
          role="student"
        />
      </div>

      {/* Desktop header only */}
      <div className="hidden pl-[2%] font-serif font-extrabold text-[13px] md:flex">
        <p className="basis-[25%]">Order ID</p>
        <p className="basis-[15%]">Date Placed</p>
        <p className="basis-[20%]">Number of Items</p>
        <p className="basis-[17%]">Total Price</p>
        <p className="basis-[10%]">Status</p>
      </div>

      <div className="flex flex-col">
        <div className="space-y-3 md:space-y-0 md:bg-[#efefef] md:rounded-2xl md:pl-[2%] md:basis-[8.3%]">
          {loading && <p className="px-3 py-2">Loading your orders...</p>}
          {!loading && data?.orders.length === 0 && <p className="px-3 py-2">No orders found.</p>}

          {!loading &&
            data &&
            data.orders.map((order) => {
              let statusClasses = "px-2 py-1 rounded-full text-white text-xs font-semibold ";
              let statusText = "";

              if (order.status === "pending") {
                statusClasses += "bg-yellow-400"; statusText = "Pending";
              } else if (order.status === "confirmed") {
                statusClasses += "bg-green-500"; statusText = "Confirmed";
              } else if (order.status === "denied") {
                statusClasses += "bg-red-500"; statusText = "Denied";
              } else if (order.status === "pick-up") {
                statusClasses += "bg-blue-400"; statusText = "Pick Up";
              } else if (order.status === "awaiting-student") {
                statusClasses += "bg-yellow-600"; statusText = "AWAITING STUDENT ACTION!";
              } else if (order.status === "student-accepted") {
                statusClasses += "bg-yellow-600"; statusText = "Awaiting Staff Action";
              } else if (order.status === "canceled") {
                statusClasses += "bg-red-500"; statusText = "Canceled By You";
              }

              return (
                <div
                  key={order.orderID}
                  className="flex items-center py-2 my-0 text-[14px] font-bold bg-white border border-gray-200 rounded-xl p-3 md:flex md:flex-row md:my-2 md:bg-[#efefef] md:rounded-2xl md:border-0 md:p-0"
                >
                  <div className="flex flex-col gap-1 w-full md:flex-row md:items-center md:w-full">
                    <div className="md:basis-[20%] md:truncate md:pr-2 md:mr-[5%]">
                      <span className="block text-xs font-medium text-gray-500 md:hidden">Order ID</span>
                      <p className="truncate">{order.orderID}</p>
                    </div>

                    <div className="md:basis-[15%]">
                      <span className="block text-xs font-medium text-gray-500 md:hidden">Date Placed</span>
                      <p>{new Date(order.datePlaced).toLocaleDateString()}</p>
                    </div>

                    <div className="md:basis-[20%]">
                      <span className="block text-xs font-medium text-gray-500 md:hidden">Number of Items</span>
                      <p>{order.items.length}</p>
                    </div>

                    <div className="md:basis-[8%]">
                      <span className="block text-xs font-medium text-gray-500 md:hidden">Total Price</span>
                      <p>${order.totalPrice.toFixed(2)}</p>
                    </div>

                    <div className="md:basis-[18%] md:flex md:justify-center">
                      <span className={statusClasses}>{statusText}</span>
                    </div>

                    <button
                      className="text-[#080a9e] hover:text-blue-800 cursor-pointer text-sm self-end md:ml-auto md:mr-6 md:self-auto "
                      onClick={() => setSelectedOrder(order)}
                    >
                      &gt; View Action
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-4 flex gap-2 items-center justify-center md:justify-end">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50 md:rounded-2xl"
        >
          Prev
        </button>
        <span>
          Page {data?.page} of {data?.totalPages}
        </span>
        <button
          disabled={data !== null && page >= data.totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50 md:rounded-2xl"
        >
          Next
        </button>
      </div>

      {selectedOrder && (
        <DetailedUserOrder order={selectedOrder} onClose={() => setSelectedOrder(null)} viewedBy="student" />
      )}
    </div>
  );
}
