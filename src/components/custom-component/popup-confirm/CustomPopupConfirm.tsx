"use client";

import styles from "@/styles/custom-component/popup-confirm/CustomPopupConfirm.module.scss";

import infomation from "@/../public/assets/images/information.png";
import React, { useEffect, useRef } from "react";
import CardDefault from "../CardDefault";
import NextImage from "../NextImage";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  opened: boolean;
  title: string;
  okText?: string;
  onOk: () => void;
  cancelText?: string;
  onCancel: () => void;
}

export default function CustomPopupConfirm({
  opened = true,
  title,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
}: Props) {
  const popupConfirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutSideHandler = (e: MouseEvent) => {
      if (!popupConfirmRef.current?.contains(e.target as Node)) onCancel();
    };
    document.addEventListener("mousedown", clickOutSideHandler);

    return () => {
      document.removeEventListener("mousedown", clickOutSideHandler);
    };
  }, []);

  if (opened)
    return (
      <div ref={popupConfirmRef}>
        <CardDefault className={styles.custom_popup_confirm_container}>
          <div className={styles.image_container}>
            <NextImage
              width={70}
              height={70}
              alt="Xác nhận"
              src={infomation}
            ></NextImage>
          </div>
          <div className={styles.title_container}>{title}</div>

          <div className={styles.description_container}>
            Bạn có chắc muốn xóa đánh giá này? Thao tác này sẽ không thể nào
            hoàn tác.
          </div>
          <div className={styles.control_container}>
            <button onClick={onCancel}>{cancelText}</button>
            <button onClick={onOk}>{okText}</button>
          </div>
        </CardDefault>
      </div>
    );
}
