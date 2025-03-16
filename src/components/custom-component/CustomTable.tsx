import styles from "@/styles/custom-component/CustomTable.module.scss";

interface Props {
  children: React.ReactNode;
}

export default function CustomTable({ children }: Props) {
  return <table className={styles.custom_table}>{children}</table>;
}
