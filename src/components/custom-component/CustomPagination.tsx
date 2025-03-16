interface Props {
  currentPage: number;
  totalPage: number;
}

export default function CustomPagination(props: Props) {
  return (
    <div>
      <button>{"<"}</button>
      {}
      <button>{">"}</button>
    </div>
  );
}
