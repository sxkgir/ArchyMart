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

    export interface CartItem extends Product {
    qty: number;
    sizeID: number;
    totalPrice: number;
    }

    export interface Size {
        sizeID: number;
        size: string;
        sizeXInch: number;
        sizeYInch: number;
    }

    export const sizes: Size[] = [
        {
            sizeID: 1,
            size: '18" x 24"',
            sizeXInch: 18,
            sizeYInch: 24,
        },
        {
            sizeID: 2,
            size: '24"x48" | 2ftx4ft',
            sizeXInch: 24,
            sizeYInch: 48,
        },
        {
            sizeID: 3,
            size: '12"x48" | 1ftx4ft',
            sizeXInch: 12,
            sizeYInch: 48,

        },
        {
            sizeID: 4,
            size: '48"x48" | 4ftx4ft',
            sizeXInch: 48,
            sizeYInch: 48,
        },
        {
            sizeID: 5,
            size: 'Sqr. Foot |1ftx1ft',
            sizeXInch: 12,
            sizeYInch: 12,
        },
        {
            sizeID: 6,
            size: '24"x96"| 2ftx8ft',
            sizeXInch: 24,
            sizeYInch: 96,
        },
        {
            sizeID: 7,
            size: '24"x24"| 2ftx2ft',
            sizeXInch: 24,
            sizeYInch: 24,
        },
        
        {
            sizeID: 8,
            size: '24"36" | 2ftx3ft',
            sizeXInch: 24,
            sizeYInch: 36,
        }
    ];

    



    export const productApi = {

        getAll : async(): Promise<Product[]> => {
            const data = (await axiosInstance.get<Product[]>("/api/products")).data
            return data;
        }

        
    }