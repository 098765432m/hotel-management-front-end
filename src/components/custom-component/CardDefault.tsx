import styles from "@/styles/custom-component/CardDefault.module.scss";
import React from "react";
import clsx from "clsx";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

// Component Card chung
export default function CardDefault({ children, className, ...rest }: Props) {
  return (
    <div className={clsx(styles.custom_card_default, className)} {...rest}>
      {children}
    </div>
  );
}
