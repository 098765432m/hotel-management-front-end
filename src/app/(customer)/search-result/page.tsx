import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import SearchResultList from "@/components/customer/search-result/search-result-list/SearchResultList";
import { transformAddressSelectInput } from "@/utils/helpers";
import axios from "axios";
import SearchPanel from "@/components/customer/search-result/search-panel/SearchPanel";
import SearchResultLayout from "@/components/customer/search-result/SearchResultLayout";
export default async function SearchResultPage() {
  const listProvinceResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}` as string
  );

  const listProvince =
    transformAddressSelectInput(listProvinceResponse.data) ?? undefined;

  return (
    <div className={styles.search_result_container}>
      <SearchResultLayout listProvince={listProvince}></SearchResultLayout>
    </div>
  );
}
