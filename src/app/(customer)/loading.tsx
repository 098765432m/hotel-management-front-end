import styles from "@/styles/customer/CustomerLoading.module.scss";
import MantineLoading from "@/components/custom-component/loading/MantineLoading";

export default function CustomerLoading() {
  return (
    <div className={styles.customer_loading_container}>
      <MantineLoading></MantineLoading>
      <div>
        <span className={styles.loading_text}>Đang tải</span>
      </div>
    </div>
  );
}
