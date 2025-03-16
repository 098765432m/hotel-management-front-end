import styles from "@/styles/custom-component/notification/ErrorCustomNotify.module.scss";

interface Props {
  message: string;
  className?: string;
}

export default function ErrorCustomNotify({ message, className }: Props) {
  return (
    <div className={`${styles.error_notify_container} ${className ?? ""}`}>
      {message}
    </div>
  );
}
