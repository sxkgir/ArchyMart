import { createContext, useContext, useEffect, useState, ReactNode,Dispatch, SetStateAction } from "react";
import { productApi, type AddProductPayload } from "../api/productsApi";
import type { Product } from "../Types/Product";
interface ProductContextType{
    getAllProducts: () => Promise<any>
    addProduct: (payload: AddProductPayload) => Promise<Product | null>;
    deleteProducts: (ids: number[]) => Promise<any>;
    message: string;

}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({children} : {children: ReactNode}) {
    
    const [message, setMessage] = useState("")

    const getAllProducts = async() =>{
        try{    
            const response = await productApi.getAll();
            console.log("Products fetched");
            return response;
        }catch(error:any){
            console.log("Error fetching products", error);
            return[];
        }
    }

    const addProduct = async (payload: AddProductPayload): Promise<Product | null> => {
        try {
            const response = await productApi.addProduct(payload);
            console.log("Product created", response.created);
            setMessage(response.message)

            return response;
        } catch (err: any) {
            console.error("Error creating product", err);
            const message = err?.response?.response?.message;
            setMessage(message || "Unexpected error occured, \nPlease contact jiangh8@rpi.edu");

            return null; // same forgiving pattern as getAllProducts

        }
    };

    const deleteProducts = async (ids: number[]) => {
        try {
            const response = await productApi.deleteMany(ids);
            setMessage(response.message);
            return response;
        } catch (err: any) {
            console.error("Error creating product", err);
            const message = err?.response?.response?.message;
            setMessage(message || "Unexpected error occured, \nPlease contact jiangh8@rpi.edu");
        }
    };


    return(
        <ProductContext.Provider value={{
            getAllProducts,addProduct, message, deleteProducts
        }}>

            {children}
        </ProductContext.Provider>
    )


}

export function useProductContext(){
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context; 
}

