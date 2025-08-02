import { createContext, useContext, useEffect, useState, ReactNode,Dispatch, SetStateAction } from "react";
import { productApi } from "../api/productsApi";
import type { Product } from "../api/productsApi";
interface ProductContextType{
    getAllProducts: () => Promise<Product[]>
    checkAuthType: () => Promise<String>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({children} : {children: ReactNode}) {

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



    return(
        <ProductContext.Provider value={{
            getAllProducts,
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

