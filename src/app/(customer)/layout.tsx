import styles from "@/styles/global.module.scss";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/customer/Header";
import CustomBreadCrumbs from "@/components/custom-component/CustomBreadCrumbs";

export default function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id={styles.guest_layout}>
      <header>
        <Header></Header>
      </header>

      <CustomBreadCrumbs
        className={styles.bread_crumbs_container}
      ></CustomBreadCrumbs>
      <main className={styles.main_layout}>{children}</main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}
