import SearchResultComponent from "@/components/customer/search-result/SearchResultComponent";
import { transformAddressSelectInput } from "@/utils/helpers";
import axios from "axios";
export default async function SearchResultLayout() {
  const listProvinceResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}` as string
  );

  const listProvince =
    transformAddressSelectInput(listProvinceResponse.data) ?? undefined;

  // console.log(listProvince);

  return (
    <div>
      <SearchResultComponent
        listProvince={listProvince}
      ></SearchResultComponent>
    </div>
  );
}
