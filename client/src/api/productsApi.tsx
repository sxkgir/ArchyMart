import axios from "axios";
import type { Size } from "../Types/Product";
const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true
}); 



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

export type AddProductPayload = {
  productName: string;
  categoryName: string;
  price: number;
  singleItem: boolean;
  availability: boolean;
  sqrFeet?: number;     // optional
  is3D: boolean;
};






export const productApi = {

    getAll : async(): Promise<any> => {
        const data = (await axiosInstance.get<any>("/api/products/getAll")).data
        return data;
    },

    addProduct: async (payload: AddProductPayload): Promise<any> => {
        const data = (await axiosInstance.post("/api/products/addOne", payload)).data;
        return data
    },

    deleteMany: async (ids: number[]): Promise<any> => {
        const data = (await axiosInstance.post("/api/products/deleteMany", { ids })).data;
        return data;
    },
    

    
}