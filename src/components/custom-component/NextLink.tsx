import Link from "next/link";
import styles from "@/styles/custom-component/NextLink.module.scss";

interface CustomLinkProps {
  href: string | Object;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  children: React.ReactNode;
}

export default function NextLink({
  href,
  replace = false,
  scroll = false,
  prefetch = undefined,
  children,
  ...props
}: CustomLinkProps) {
  return (
    <Link
      href={href}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      className={styles.custom_link}
      {...props}
    >
      {children}
    </Link>
  );
}
