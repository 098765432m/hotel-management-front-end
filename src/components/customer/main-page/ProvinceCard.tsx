"use client";

import CardDefault from "@/components/custom-component/CardDefault";
import styles from "@/styles/customer/main-page/MainPage.module.scss";
import { useRouter } from "next/navigation";

interface Props {
  index: number;
  name: string;
  provinceId: string;
}
export default function ProvinceCard({ name, index, provinceId }: Props) {
  const router = useRouter();

  return (
    <CardDefault
      className={styles.province_card}
      onClick={() => {
        router.push(
          `/search-result?provinceId=${encodeURIComponent(provinceId)}`
        );
      }}
    >
      <span>
        {index + 1}. {name}
      </span>
    </CardDefault>
  );
}
