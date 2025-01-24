"use server";

import axios from "axios";

export async function fetchVNProvinces() {
  const result = await axios.get(
    process.env.NEXT_PUBLIC_VN_ADDRESS_URL as string
  );

  console.log(result.data);
}
