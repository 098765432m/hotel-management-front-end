// export interface Address {
//   street: string;
//   ward: string;
//   district: string;
//   province: string;
// }

interface info {
  id: string;
  name: string;
}

export interface AddressType {
  street: string;
  ward: info;
  district: info;
  province: info;
}
