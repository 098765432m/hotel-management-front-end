import styles from "@/styles/custom-component/pagination/MantinePagination.module.scss";
import { Pagination, PaginationProps } from "@mantine/core";

interface Props extends PaginationProps {
  total: number;
}

export default function MantinePagination({ total, ...restProps }: Props) {
  return (
    <div className={styles.mantine_pagination}>
      <Pagination color="yellow" total={total} {...restProps}></Pagination>
    </div>
  );
}
