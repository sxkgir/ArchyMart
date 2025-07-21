
import { useEffect, useState } from "react"
import Search from "../assets/Search.svg?react"
import { useProductContext } from "../contexts/ProductProvider";
import type { Product } from "../api/products";
export function OrderContent(){
    const [searchInput, setSearchInput] = useState("");
    const { getAllProducts } = useProductContext();
    const [items, setItems] = useState<Product[]>([]);            // local copy to render
    useEffect(() => {
    (async () => {                // ← define
        const data = await getAllProducts();
        console.log("data:", data);
        setItems(data);
        console.log("Items:",data)
    })();                      
    }, [getAllProducts]);

    return( 
        <div className="">
            <div className="pt-[5%] pl-[5%] flex flex-col items-center w-[40%]">
                <div className="relative w-[60%]"> {/* controls total width */}
                    <input
                    className="border-2 rounded-2xl outline-0 px-3 pr-10 w-full h-10"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search..."
                    />
                    <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="border-2 overflow-y-auto w-[100%] h-[450px] mt-5">
                    {items.map((p) => (
                        <div
                        key={p.productID}
                        className="p-2 px-4"
                        >
                        {p.productName}
                        </div>
                    ))}


                </div>
                
            </div>





        </div>

    )


     
}