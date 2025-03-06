import { Modal, ModalProps } from "@mantine/core";

interface Props extends ModalProps {}

export default function MantineModal({ ...restProps }: Props) {
  return <Modal lockScroll={true} centered {...restProps}></Modal>;
}
