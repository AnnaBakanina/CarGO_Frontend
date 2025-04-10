import { User } from './user';
import { KeyValuePair } from "./keyValuePair";

export interface Vehicle {
    id: number;
    userId?: number;
    modelId: number;
    makeId: number;
    carTypeId: number;
    techStateId: number;
    yearOfRelease: number;
    vinNumber: string;
    carMileage: number;
    description: string;
    isAuction: boolean;
    isPaymentInParts: boolean;
    isTaxable: boolean;
    phoneNumber: string;
}