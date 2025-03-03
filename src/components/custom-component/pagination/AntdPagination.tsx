import { Pagination, PaginationProps } from "antd";
import styles from "@/styles/custom-component/pagination/AntdPagination.module.scss";
interface Props extends PaginationProps {
  total: number;
}

export default function AntdPagination({ total, ...restProps }: Props) {
  return (
    <div className={styles.antd_pagination}>
      <Pagination
        align="center"
        size="small"
        defaultPageSize={parseInt(
          process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE as string
        )}
        total={total}
        {...restProps}
      ></Pagination>
    </div>
  );
}
