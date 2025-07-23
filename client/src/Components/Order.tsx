
import { useEffect, useState } from "react"
import Search from "../assets/Search.svg?react"
import Load from "../assets/Load.svg?react"
import { useProductContext } from "../contexts/ProductProvider";
import type { Product } from "../api/products";
import AddToCartButton from "./AddtoCart"; 
export function OrderContent(){
    const [searchInput, setSearchInput] = useState("");
    const { getAllProducts } = useProductContext();
    const [items, setItems] = useState<Product[]>([]);            // local copy to render
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);    
    const [activeHoverProductID, setActiveHoverProductID] = useState("");  

    useEffect(() => {
    (async () => {              
        try{
            const data = await getAllProducts();
            setItems(data);
        }
        catch (err) {
            console.log(error)
            setError(err as Error);  
        }
        finally {
            setLoading(false);
        }
        {} 
    })();                      
    }, [getAllProducts]);

    const filtered = items.filter((item) => item.productName.toLowerCase().includes(searchInput.toLowerCase()))


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
                <div className={"border-2 overflow-y-auto w-[100%] h-[450px] mt-5 " + (loading ? " flex items-center justify-center" : "")} >
                    {loading && <Load className="w-35 h-35 " />}
                    
                    {!loading && !error && filtered.map((p) => ( 
                        <button
                        key={p.productID}
                        className={`p-2 px-4 block hover:cursor-pointer hover:bg-gray-400 w-full flex ${activeHoverProductID == p.productID ? "bg-gray-400" : ""}` } 
                        onClick={() => setActiveHoverProductID(p.productID)} 
                        >
                        {p.productName}
                        </button>
                    ))}
                    
                    {!loading && error && (
                        <p>
                            {error.message}
                        </p>
                    )} 

                </div>
                <AddToCartButton disabled={activeHoverProductID === ""}/>
                
            </div>






        </div>

    )


     
}