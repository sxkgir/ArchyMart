
import { useEffect, useState } from "react"
import Search from "../assets/Search.svg?react"
import Load from "../assets/Load.svg?react"
import { useProductContext } from "../contexts/ProductProvider";
import type { Product } from "../api/productsApi";
import AddToCartButton from "./AddtoCart"; 
import OrderSentModal from "./ConfirmationModal";
import type { CartItem } from "../api/productsApi";
import SizeDropdown from "./SizeDropDown";
import { sizes } from "../api/productsApi";
export function OrderContent(){
    const [searchInput, setSearchInput] = useState("");
    const { getAllProducts } = useProductContext();
    const [items, setItems] = useState<Product[]>([]);            // local copy to render
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);    
    const [activeHoverProductID, setActiveHoverProductID] = useState("");  
    const [cartItems,setCartItems] = useState<CartItem[]>([]);
    const [orderSent, setOrderSent] = useState(false);




    //calculates total price of cartItem
    useEffect(() => {

        const updated = cartItems.map((item) =>{
            if (item.sizeID !== null && !item.singleItem){
                const sizeObj = sizes.find(obj => obj.sizeID === item.sizeID);
                if (!sizeObj)
                    return item;

                
                const priceCalculation = Number(((sizeObj.sizeXInch * sizeObj.sizeYInch) / 144)*(item.price / item.sqrFeet)).toFixed(2);
                console.log(priceCalculation);
                console.log(sizeObj.sizeXInch,sizeObj.sizeYInch)
                return {...item, totalPrice: priceCalculation};
            }

            return item //returns the array of cartItems if it sizeID is null
        })
        const hasChanges = updated.some((u, i) => u !== cartItems[i]);

        if (hasChanges) {
            setCartItems(updated);
        }

    },[JSON.stringify(cartItems.map(i => ({ id: i.productID, sizeID: i.sizeID, quantity: i.qty, total: i.totalPrice }))),])

    //cartReady is always in sync, because it's derived directly from the current state
    const cartReady = cartItems.length > 0 && cartItems.every(item =>
    item.singleItem || (item.totalPrice !== undefined)
    );

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

    const filtered = items.filter((item) => item.availability && 
                                            item.productName.toLowerCase().includes(searchInput.toLowerCase()))

    console.log(items.map((p) => p.productName))
    useEffect(()=> {console.log(orderSent)},[orderSent])

    return( 
        <div className="flex gap-[6%] pt-[5%] ">        
            {<OrderSentModal isOpen={orderSent} onClose={() => {setCartItems([]), setOrderSent(false)}}/>}

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

            <div className="border-2 rounded-3xl w-[85%] flex-col justify-center items-center ">
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
                <div className={"border-t-black border-t-2 overflow-y-auto w-[100%] h-[70%] mt-[1%] pb-[2%]" + (loading ? " flex items-center justify-center" : "")} >
                    {loading && <Load className="w-35 h-35 " />}
                    
                    {!loading && !error && cartItems.map((c) => ( 
                        <div
                        key={c.productID}
                        className={`ml-4 mt-4 w-full text-[14px] flex `}
                        >
                        <p className="basis-[41%] "> {c.productName} </p>
                        <p className="basis-[15%]"> {c.categoryName} </p>
                        <p className="basis-[8%]"> ${c.price} </p>
                        <div className="basis-[16%] shrink-0">
                            {c.categoryName === "Sheet good" && <SizeDropdown selectedID={c.sizeID ?? null} onChange={(newID) => {
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
                                ${c.categoryName === "Single Each" ? Number(c.price *c.qty).toFixed(2) : c.totalPrice} 
                            </p>

                        </div>
                    ))}
                    
                    {!loading && error && (
                        <p>
                            {error.message}
                        </p>
                    )} 
                </div>    

                <div className="w-full flex justify-center">
                    <button
                    type="button"
                    disabled={!cartReady}
                    onClick={() => setOrderSent(true)}
                    className="
                        mt-5 bg-green-600 text-white
                        font-semibold px-6 py-3 rounded-lg
                        hover:bg-green-700
                        active:bg-green-800
                        disabled:bg-gray-400 disabled:cursor-not-allowed
                        transition
                    "
                    >
                    Place Order
                    </button>
                </div>

                

            </div>






        </div>

    )


     
}