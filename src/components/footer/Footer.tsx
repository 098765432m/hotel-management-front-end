// import styles from "@/styles/footer/footer.module.scss";
import styles from "@/styles/footer/footer.module.scss";
export default function Footer() {
  return (
    <div className={styles.footer}>
      {/* <div className={styles.footer_content_container}>
        <div>Trang chủ</div>
        <div>Về chúng tôi</div>
        <div>Lịch sử</div>
        <div>Liên hệ</div>
        <div>Facebook</div>
        <div>Tiktok</div>
      </div> */}
      <div className={styles.footer_signature_container}>
        Được thực hiện bởi Trần An Phú
      </div>
    </div>
  );
}
