import { User } from './user';
import { KeyValuePair } from "./keyValuePair";

export interface Vehicle {
    id: number;
    user: User;
    model: KeyValuePair;
    make: KeyValuePair;
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
}