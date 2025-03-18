import styles from "@/styles/custom-component/loading/MantineLoading.module.scss";
import { Loader } from "@mantine/core";
import clsx from "clsx";

interface Props {
  classNames?: String;
}

export default function MantineLoading(props: Props) {
  return (
    <div className={clsx(styles.mantine_loading_container, props.classNames)}>
      <Loader type="bars" size={44} color="yellow"></Loader>
      <div>
        <span className={styles.loading_text}>Đang tải</span>
      </div>
    </div>
  );
}
