// import styles from "@/styles/footer/footer.module.scss";
import styles from "@/styles/footer/footer.module.scss";
export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footer_content_container}>
        <span className={styles.footer_content_column}>
          <div>row 1</div>
          <div>row 2</div>
          <div>row 3</div>
        </span>
        <span className={styles.footer_content_column}>
          <div>row 1</div>
          <div>row 2</div>
          <div>row 3</div>
        </span>
        <span className={styles.footer_content_column}>
          <div>row 1</div>
          <div>row 2</div>
          <div>row 3</div>
        </span>
      </div>
      <div className={styles.footer_signature_container}>
        Được thực hiện bởi Trần An Phú
      </div>
    </div>
  );
}
