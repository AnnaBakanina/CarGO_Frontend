import { KeyValuePair } from './keyValuePair';
export interface Brand {
    id: number;
    name: string;
    carModel: KeyValuePair[];
  }