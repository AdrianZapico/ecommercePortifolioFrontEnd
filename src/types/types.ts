export interface Product {
    _id: string;
    name: string;
    image: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
}



export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token?: string;
}