import styles from "@/styles/custom-component/notification/SuccessCustomNotify.module.scss";

interface Props {
  message: string;
}

export default function SuccessCustomNotify({ message }: Props) {
  return <div className={styles.success_notify_container}>{message}</div>;
}
