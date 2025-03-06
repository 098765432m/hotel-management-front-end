import { Loader } from "@mantine/core";

export default function MantineLoading() {
  return (
    <div className="flex justify-center">
      <Loader size={44} color="yellow"></Loader>
    </div>
  );
}
