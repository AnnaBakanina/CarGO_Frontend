import { User } from './user';
import { KeyValuePair } from "./keyValuePair";

export interface Vehicle {
    id: number;
    user?: User;
    model: KeyValuePair;
    brand: KeyValuePair;
    carType: KeyValuePair;
    techState: KeyValuePair;
    yearOfRelease: number;
    vinNumber: string;
    carMileage: number;
    description: string;
    isAuction: boolean;
    isPaymentInParts: boolean;
    isTaxable: boolean;
    phoneNumber: string;
    region: KeyValuePair;
    city: KeyValuePair;
}