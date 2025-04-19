import { KeyValuePair } from './keyValuePair';
export interface Region {
  id: number;
  name: string;
  city: KeyValuePair[];
}