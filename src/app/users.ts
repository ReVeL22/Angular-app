export interface IUsers {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: {
        city: string;
        country: string;
        postal_code: string;
        street: string;
    }
}