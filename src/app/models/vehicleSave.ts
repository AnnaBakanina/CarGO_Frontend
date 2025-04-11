export interface VehicleSave {
    id: number;
    userId?: number;
    modelId: number;
    brandId: number;
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
    regionId: number;
    cityId: number;
}