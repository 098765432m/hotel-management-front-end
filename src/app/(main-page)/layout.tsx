import styles from "@/styles/global.module.scss";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/customer/Header";
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id={styles.guest_layout}>
      <header>
        <Header></Header>
      </header>
      <main className={styles.main_page_layout}>{children}</main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}
