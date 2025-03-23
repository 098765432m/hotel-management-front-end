import styles from "@/styles/custom-component/EmptyData.module.scss";
import Image from "next/image";
import no_result from "@/../public/assets/images/no-results-64.png";

// Hien thi UI trang thai khong co data
export default function EmptyData() {
  return (
    <div className={styles.empty_data}>
      <Image src={no_result} alt="Empty data" priority></Image>
      <div className={styles.empty_data_text}>Không có dữ liệu</div>
    </div>
  );
}
