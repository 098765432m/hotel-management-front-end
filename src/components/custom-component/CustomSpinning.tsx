import { Spin, SpinProps } from "antd";
import styles from "@/styles/custom-component/CustomSpinning.module.scss";

export default function CustomSpinning({ ...props }: SpinProps) {
  return (
    <div className={styles.custom_spinning}>
      <Spin {...props}></Spin>
    </div>
  );
}
