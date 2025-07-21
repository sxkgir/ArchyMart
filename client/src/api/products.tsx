    import axios from "axios";

    const axiosInstance = axios.create({
        baseURL: "http://localhost:3000/",  
        withCredentials: true
    }); 

    export interface Product {
    _id: number;
    productID: string;
    productName: string;
    categoryName: string;
    price: number;
    singleItem:boolean;   
    availability: boolean;
    sqrFeet: number;
    dateAdded?: string;
    dateRemoved?: string;
    }

    export const productApi = {

        getAll : async(): Promise<Product[]> => {
            const data = (await axiosInstance.get<Product[]>("/api/products")).data
            return data;
        }

        
    }