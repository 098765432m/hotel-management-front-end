import styles from "@/styles/custom-component/NextImage.module.scss";

import Image, { ImageProps } from "next/image";

interface CustomeNextImageProps extends ImageProps {}

export default function NextImage(props: CustomeNextImageProps) {
  return (
    <div className={styles.custom_next_image}>
      <Image {...props} alt=""></Image>
    </div>
  );
}
