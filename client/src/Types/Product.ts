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

