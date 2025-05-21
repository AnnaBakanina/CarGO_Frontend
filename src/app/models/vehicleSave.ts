export interface VehicleSave {
    userId?: string;
    modelId: number;
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
    cityId: number;
    price: number;
    advertisementStatusId: number;
}