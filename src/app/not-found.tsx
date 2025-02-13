import styles from "@/styles/not-found/NotFoundPage.module.scss";
import MantineButton from "@/components/custom-component/MantineButton";
import NextLink from "@/components/custom-component/NextLink";

export default function NotFoundPage() {
  return (
    <div className={styles.not_found_page_container}>
      <h2>Lỗi 404 - Đường dẫn không tồn tại</h2>
      <NextLink href={"/"}>
        <MantineButton>Về trang chủ</MantineButton>
      </NextLink>
    </div>
  );
}
