import styles from "@/styles/not-found/NotFoundPage.module.scss";
import MantineButton from "@/components/custom-component/MantineButton";
import NextLink from "@/components/custom-component/NextLink";
import CardDefault from "@/components/custom-component/CardDefault";

export default function NotFoundPage() {
  return (
    <div className={styles.not_found_page_container}>
      <CardDefault className={styles.inner_block}>
        <h2>Lỗi 404 - Đường dẫn không tồn tại</h2>
        <NextLink href={"/"}>
          <MantineButton>Về trang chủ</MantineButton>
        </NextLink>
      </CardDefault>
    </div>
  );
}
