
import { useEffect, useState } from "react"
import Search from "../assets/Search.svg?react"
import Load from "../assets/Load.svg?react"
import { useProductContext } from "../contexts/ProductProvider";
import type { Product } from "../Types/Product";
import AddToCartButton from "./UI/AddtoCart"; 
import MessageModal from "./UI/MessageModal";
import type { CartItem } from "../Types/Product";
import SizeDropdown from "./UI/SizeDropDown";
import { sizes } from "../api/productsApi";
import { useOrderContext } from "../contexts/OrderProvider";


export default function OrderContent(){
    const {placeOrder, message} = useOrderContext();
    const [searchInput, setSearchInput] = useState("");
    const { getAllProducts } = useProductContext();
    const [items, setItems] = useState<Product[]>([]);            // local copy to render
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);    
    const [activeHoverProductID, setActiveHoverProductID] = useState("");  
    const [cartItems,setCartItems] = useState<CartItem[]>([]);
    const [orderSent, setOrderSent] = useState(false); 
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [studentRIN, setStudentRIN] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [formID, setFormID] = useState("");
    const [userRole, setUserRole] = useState("");
    
    
    const [rinInput, setRinInput] = useState<string>("");  // holds what's typed
    const [rinError, setRinError] = useState<string>("");
    const [touched, setTouched] = useState(false);

    const isRinValid = /^\d{9}$/.test(rinInput);  // validate the string
    const showError = touched && !isRinValid;
        // keep error in sync as user types
    useEffect(() => {
    if (!touched) {
        setRinError("");
        return;
    }
    setRinError(isRinValid ? "" : "RIN must be exactly 9 digits");
    }, [touched, isRinValid]);


    //calculates total price of a cartItem not total cart
    useEffect(() => {

        const updated = cartItems.map((item) =>{
            if (item.sizeID !== null && !item.singleItem){
                const sizeObj = sizes.find(obj => obj.sizeID === item.sizeID);
                if (!sizeObj)
                    return item;

                
                const priceCalculation = Number(((((sizeObj.sizeXInch * sizeObj.sizeYInch) / 144)*(item.price / item.sqrFeet))*item.qty).toFixed(2));
                console.log(priceCalculation);
                return {...item, totalPrice: priceCalculation};
            }
            if (item.singleItem) {
                return {
                ...item,
                totalPrice: Number((item.price * item.qty).toFixed(2))
                };
            }
             
            return item //returns the array of cartItems if it sizeID is null
        })

        const hasChanges = updated.some((u, i) => u !== cartItems[i]);

        if (hasChanges) {
            setCartItems(updated);
        }

        const total = updated.reduce((sum, item) => {
            if (item.totalPrice === undefined || item.totalPrice === null) return sum;
            return sum + item.totalPrice;
        }, 0);
        setTotalCartPrice(Number(total.toFixed(2)));

    },[JSON.stringify(cartItems.map(i => ({ id: i.productID, sizeID: i.sizeID, quantity: i.qty, total: i.totalPrice }))),])

    //cartReady is always in sync, because it's derived directly from the current state
    const cartReady = cartItems.length > 0 && cartItems.every(item =>
    item.singleItem || (item.totalPrice !== undefined)
    );

    const buildCartItem = (p: Product): CartItem => ({
        _id: Date.now(),                 // or any unique id you use
        productID: p.productID,
        productName: p.productName,
        categoryName: p.categoryName,
        price: p.price,
        singleItem: p.singleItem,
        availability: p.availability,
        sqrFeet: p.sqrFeet,
        qty: 1,
        sizeID: null,                    // no size selected yet
        totalPrice: p.singleItem ? p.price : 0 // effect will recalc later for sheet goods
    });
    
    const handleAddCart = () => {
        if (!activeHoverProductID) return;

        const product = items.find(p => p.productID === activeHoverProductID);
        if (!product) return;
        
        setCartItems(prev => {
            const idx = prev.findIndex(c => c.productID === product.productID);
            if (idx !== -1) {
            // return a proper CartItem[] (no unions)
            const next = [...prev];
            const existing = next[idx];
            const updated: CartItem = { ...existing, qty: existing.qty + 1 };
            next[idx] = updated;
            return next;
            }
            // add a fully-typed CartItem
            return [...prev, buildCartItem(product)];
        });

        setActiveHoverProductID("");
    };

    const handlePlaceOrder = async() =>{
        try{
            try{
                setIsSubmitting(true);
                await placeOrder(
                //parameter destructuring. It extracts these properties from each cartItem object automatically. It
                cartItems.map(({productID,productName,categoryName,qty,price,totalPrice})=>({
                    productID,
                    productName,
                    unitPrice: price,
                    category: categoryName,
                    qty,
                    totalPrice,
                })),
                totalCartPrice,
                studentRIN,
                formID
                );

            }
            finally{
                setIsSubmitting(false);
                setOrderSent(true);
                setShowModal(true);
                setCartItems([]);
                setStudentRIN(0)
                setRinInput("");
            }

        }
        catch(error){
            console.error("Order failed:", error);
        }
    }



    useEffect(() => {
    (async () => {              
        try{
            const data = await getAllProducts();
            setItems(data.products);
            setUserRole(data.role);
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
        <div className="">
            {userRole === "staff" &&
                <div>
                    <b className="flex justify-center">Staff Order For Students</b>
                    <div className="flex gap-[10%] pt-6 justify-center">
                        <div className="flex w-[25%] flex-col text-left">
                            <label className="text-sm font-medium mb-1 text-gray-800">Student RIN</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={9}
                                value={rinInput}
                                onChange={(e) => {
                                setTouched(true);
                                const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 9);
                                setRinInput(digitsOnly);

                                // Only set the numeric state when valid 9 digits
                                if (/^\d{9}$/.test(digitsOnly)) {
                                    setStudentRIN(Number(digitsOnly));
                                }
                                }}
                                className={`border-2 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                                showError ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-blue-500"
                                }`}
                                placeholder="Enter 9-digit RIN"
                            />
                            {showError && (
                                <span className="text-xs text-red-500 mt-1">RIN must be exactly 9 digits</span>
                            )}
                        </div>
                        <div className="flex flex-col w-[25%]">
                            <label className="text-sm font-medium mb-1 text-gray-800">
                            formID
                            </label>
                            <input
                                type="text"
                                className="border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Optional (FormID for 3D Print only)"
                                value={formID}
                                onChange={(e) => setFormID(e.target.value)}
                            />
                        </div>
                    </div>

                </div>
            }
            <div className="flex gap-[6%] pt-[3%] items-center">        
                {showModal && <MessageModal message={message} onClose={() => setShowModal(false)}/>}
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

                <div className="border-2 rounded-3xl w-[85%] h-[650px] flex flex-col ">
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
                                    ${c.totalPrice} 
                                </p>

                            </div>
                        ))}
                        
                        {!loading && error && (
                            <p>
                                {error.message}
                            </p>
                        )} 

                    </div>    
                    <div className="text-center">
                        Total Price: ${totalCartPrice}
                    </div>

                    <div className="w-full flex justify-center relative group">
                        <button
                            type="button"
                            disabled={!cartReady || isSubmitting || (!isRinValid && userRole === "staff")}
                            onClick={handlePlaceOrder}
                            className={`
                            mt-5 flex items-center justify-center gap-2
                            px-6 py-3 rounded-lg font-semibold transition
                            disabled:bg-gray-400 disabled:cursor-not-allowed
                            ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:bg-green-800"}
                            text-white
                            `}
                        >
                            {isSubmitting && <Load className="w-5 h-5 animate-spin" />}
                            {isSubmitting ? "Placing Order..." : "Place Order"}
                        </button>

                        {!isRinValid && (
                            <span
                            className="
                                absolute -top-4 bg-black text-white text-xs rounded-md px-2 py-1 
                                opacity-0 group-hover:opacity-100 transition-opacity
                            "
                            >
                            Please enter a valid 9-digit RIN
                            </span>
                        )}
                    </div>

                </div>

            </div>

        </div>

    )


     
}