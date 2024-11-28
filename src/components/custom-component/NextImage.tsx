import styles from "@/styles/custom-component/Nextimage.module.scss";

import Image, { ImageProps } from "next/image";

interface CustomeNextImageProps extends ImageProps {}

export default function NextImage(props: CustomeNextImageProps) {
  return <Image {...props} className={styles.custom_next_image}></Image>;
}
