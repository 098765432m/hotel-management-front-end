import MantineButton from "@/components/custom-component/MantineButton";
import NextLink from "@/components/custom-component/NextLink";

export default function EditRoomMaintenancePage() {
  return (
    <div>
      <title>Trang chinh sua bao tri</title>
      <div>
        <NextLink href={"/dashboard/maintenance"}>
          <MantineButton>Tro ve</MantineButton>
        </NextLink>
      </div>
    </div>
  );
}
