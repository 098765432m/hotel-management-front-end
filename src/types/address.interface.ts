export type info = {
  id: string;
  name: string;
};

export interface AddressType {
  street: string;
  ward: info;
  district: info;
  province: info;
}
