import { Pagination, PaginationProps } from "antd";

interface Props extends PaginationProps {
  total: number;
}

export default function AntdPagination({ total, ...restProps }: Props) {
  return (
    <Pagination
      align="center"
      size="small"
      defaultPageSize={parseInt(
        process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE as string
      )}
      total={total}
      {...restProps}
    ></Pagination>
  );
}
