
import { useEffect, useState } from "react"
import Search from "../assets/Search.svg?react"
import Load from "../assets/Load.svg?react"
import { useProductContext } from "../contexts/ProductProvider";
import type { Product } from "../api/products";
import AddToCartButton from "./AddtoCart"; 
import type { CartItem } from "../api/products";
import SizeDropdown from "./SizeDropDown";
import { sizes } from "../api/products";
export function OrderContent(){
    const [searchInput, setSearchInput] = useState("");
    const { getAllProducts } = useProductContext();
    const [items, setItems] = useState<Product[]>([]);            // local copy to render
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);    
    const [activeHoverProductID, setActiveHoverProductID] = useState("");  
    const [cartItems,setCartItems] = useState<CartItem[]>([]);

    //calculates total price of cartItem
    useEffect(() => {
        const updated = cartItems.map((item) =>{
            if (item.sizeID !== null){
                console.log("hi");
                const sizeObj = sizes.find(obj => obj.sizeID === item.sizeID);
                if (!sizeObj)
                    return item;
                const priceCalculation = Number(((((sizeObj.sizeXInch * sizeObj.sizeYInch) / 144)/ item.sqrFeet) * item.price) * item.qty).toFixed(3);

                return {...item, totalPrice: priceCalculation};
            }
            return item //returns the array of cartItems if it sizeID is null
        })
        const hasChanges = updated.some((u, i) => u !== cartItems[i]);

        if (hasChanges) {
            setCartItems(updated);
        }

    },[JSON.stringify(cartItems.map(i => ({ id: i.productID, sizeID: i.sizeID, quantity: i.qty }))),])


    const handleAddCart = () => {
        if (!activeHoverProductID) return;                  

        const product = items.find(p => p.productID === activeHoverProductID);
        if (!product) return;

        setCartItems(prev => {
            const existing = prev.find(c => c.productID === product.productID);
            if (existing)   {
                return prev.map( c =>
                                 c.productID === product.productID
                                 ? { ...c, qty: c.qty + 1 }     
                                 : c)
            }
            return [...prev, { ...product, qty: 1 }]; // OK: CartItem
        })
        setActiveHoverProductID("");

    }

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
        {} []
    })();                      
    }, [getAllProducts]);

    const filtered = items.filter((item) => item.productName.toLowerCase().includes(searchInput.toLowerCase()))


    return( 
        <div className="flex gap-[6%] pt-[5%]">
            <div className=" pl-[3%] flex flex-col items-center w-[41%]">
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
                        className={`p-2 px-4 block hover:cursor-pointer hover:bg-gray-400 w-full flex
                        ${activeHoverProductID == p.productID ? "bg-gray-400" : ""}` } 
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
                <AddToCartButton disabled={activeHoverProductID === ""} onClick={handleAddCart}/>
                
            </div>

            <div className="border-2 rounded-3xl w-[85%] flex-col justify-center items-center">
                <p className="text-center font-extrabold text-[20px] mb-[3%]">
                    Shopping Cart
                </p>
                <div className="flex pl-4 text-gray-500 font-bold text-[14px]">
                   <p className="basis-[45%] ">Product</p>
                   <p className="basis-[15%]">Category</p>
                   <p className="basis-[14%]">Price</p>
                   <p className="basis-[12%]">Size</p>
                   <p className="basis-[10%] pl-[5%]">Qty</p>
                   <p className="basis-[11%] pl-[3%]">Total</p>
                 
                </div>
                <div className={"border-t-black border-t-2 overflow-y-auto w-[100%] h-[450px] mt-[1%] " + (loading ? " flex items-center justify-center" : "")} >
                    {loading && <Load className="w-35 h-35 " />}
                    
                    {!loading && !error && cartItems.map((c) => ( 
                        <div
                        key={c.productID}
                        className={`ml-4 mt-4 w-full text-[14px] flex `}
                        >
                        <p className="basis-[40%] "> {c.productName} </p>
                        <p className="basis-[15%]"> {c.categoryName} </p>
                        <p className="basis-[8%]"> {c.price} </p>
                        <div className="basis-[16%] shrink-0">
                            {c.categoryName === "4X8 Sheet good" && <SizeDropdown selectedID={c.sizeID ?? null} onChange={(newID) => {
                                setCartItems((prev) =>
                                    prev.map((item) => item.productID === c.productID ? {...item, sizeID: newID} : item)
                                )
                            }}/>}
                        </div>
                        <div className="basis-[10%] flex items-center gap-1 pl-[3%]">
                            <input
                                type="number"
                                min={1}
                                value={c.qty}
                                onChange={(e) => {
                                    const newQty = Math.max(1, parseInt(e.target.value) || 1);
                                    setCartItems(prev =>
                                        prev.map(item =>
                                            item.productID === c.productID
                                                ? { ...item, qty: newQty }
                                                : item
                                        )
                                    );
                                }}
                                className="w-12 text-center border rounded"
                            />

                        </div>        
                            <p className="basis-[11%] pl-[2%]"> 
                                {c.categoryName === "Single Each" ? c.price *c.qty : c.totalPrice} 
                                
                            </p>

                        </div>
                    ))}
                    
                    {!loading && error && (
                        <p>
                            {error.message}
                        </p>
                    )} 
                </div>    


                

            </div>






        </div>

    )


     
}