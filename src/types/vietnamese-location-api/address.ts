export interface Province {
  id: string;
  name: string;
  type: number;
  typeText: string;
  slug: string;
}

export interface District {
  id: string;
  provinceId: string;
  name: string;
  type: number;
  typeText: string;
}

export interface Ward {
  id: string;
  districtId: string;
  name: string;
  type: number;
  typeText: string;
}

export type Info = {
  name: string;
  id: string;
};

export const null_address: Info = {
  name: "",
  id: "",
};

export enum DispatchType {
  SET_PROVINCE = "SET_PROVINCE",
  SET_DISTRICT = "SET_DISTRICT",
  SET_WARD = "SET_WARD",
  SET_STREET = "SET_STREET",
  SET_EXISTED = "SET_EXISTED",
}

export const initialAddress = {
  street: "",
  ward: null_address,
  district: null_address,
  province: null_address,
};

export type AddressType = {
  street: string;
  ward: Info;
  district: Info;
  province: Info;
};

export type ActionAddress =
  | {
      type: DispatchType.SET_PROVINCE;
      payload: { province: Info; district?: Info; ward?: Info };
    }
  | {
      type: DispatchType.SET_DISTRICT;
      payload: { district: Info; ward?: Info };
    }
  | { type: DispatchType.SET_WARD; payload: { ward: Info } }
  | { type: DispatchType.SET_STREET; payload: { street: string } }
  | {
      type: DispatchType.SET_EXISTED;
      payload: { street: string; district: Info; ward: Info; province: Info };
    };
