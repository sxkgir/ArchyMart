// types
type OrderItem = {
  productID: string;
  productName: string;
  sizeID?: number;
  qty: number;
  totalPrice: number; // line total
};

type Order = {
  orderID: string;
  orderedBy: string;           // ObjectId -> you can populate to a name/email if you want
  items: OrderItem[];
  totalPrice: number;          // order total
  confirmed: boolean;
  datePlaced: string;          // ISO date
  confirmedDate?: string;
};

import { useMemo, useState } from "react";

const money = (n:number)=> n.toLocaleString(undefined,{style:"currency",currency:"USD"});
const fmtDate = (d:string)=> new Date(d).toLocaleString();

export default function OrderHistory({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all"|"confirmed"|"pending">("all");
  const [open, setOpen] = useState<string | null>(null);

  const view = useMemo(() => {
    let v = [...orders].sort((a,b)=> +new Date(b.datePlaced) - +new Date(a.datePlaced));
    if (query.trim()) v = v.filter(o => o.orderID.toLowerCase().includes(query.toLowerCase()));
    if (status !== "all") v = v.filter(o => status==="confirmed"? o.confirmed : !o.confirmed);
    return v;
  }, [orders, query, status]);

  return (
    <div className="space-y-4">
      {/* controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="input input-bordered w-64 bg-gray-800 text-white"
          placeholder="Search by Order ID…"
          value={query}
          onChange={e=>setQuery(e.target.value)}
        />
        <select
          className="select select-bordered bg-gray-800 text-white"
          value={status}
          onChange={e=>setStatus(e.target.value as any)}
        >
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
        </select>
        <div className="ml-auto text-sm opacity-70">{view.length} orders</div>
      </div>

      {/* list */}
      <div className="divide-y divide-gray-700 rounded-xl overflow-hidden bg-gray-900">
        {view.map(o => {
          const isOpen = open === o.orderID;
          return (
            <div key={o.orderID}>
              {/* row header */}
              <button
                className="w-full text-left p-4 hover:bg-gray-800 flex items-center gap-4"
                onClick={()=> setOpen(isOpen ? null : o.orderID)}
              >
                <div className="font-mono text-sm">
                  #{o.orderID.slice(0,8)}
                  <button
                    className="ml-2 text-xs underline opacity-70"
                    onClick={(e)=>{e.stopPropagation(); navigator.clipboard.writeText(o.orderID);}}
                  >
                    copy
                  </button>
                </div>
                <div className="text-sm opacity-80">{fmtDate(o.datePlaced)}</div>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  o.confirmed ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
                }`}>
                  {o.confirmed ? "Confirmed" : "Pending"}
                </span>
                {o.confirmed && o.confirmedDate && (
                  <span className="text-xs opacity-60">on {fmtDate(o.confirmedDate)}</span>
                )}
                <div className="ml-auto font-semibold">{money(o.totalPrice)}</div>
              </button>

              {/* details */}
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left opacity-70">
                        <tr>
                          <th className="py-2">Product</th>
                          <th className="py-2">Size</th>
                          <th className="py-2">Qty</th>
                          <th className="py-2 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {o.items.map((it, i) => (
                          <tr key={i}>
                            <td className="py-2">{it.productName}</td>
                            <td className="py-2">{it.sizeID ?? "—"}</td>
                            <td className="py-2">{it.qty}</td>
                            <td className="py-2 text-right">{money(it.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {view.length === 0 && (
          <div className="p-10 text-center text-sm opacity-70">No orders found.</div>
        )}
      </div>
    </div>
  );
}
