import styles from "@/styles/global.module.scss";
import DashboardHeader from "@/components/header/dashboard/DashboardHeader";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id={styles.dashboard_layout}>
      <header>
        <DashboardHeader></DashboardHeader>
      </header>
      <main className={styles.main_layout}>{children}</main>
    </div>
  );
}
