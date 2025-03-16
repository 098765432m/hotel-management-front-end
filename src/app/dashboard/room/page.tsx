import styles from "@/styles/dashboard/room/Room.module.scss";
import RoomForm from "@/components/dashboard/Room/RoomForm";
import RoomList from "@/components/dashboard/Room/RoomList";
export default function RoomPage() {
  return (
    <div className={styles.room_container}>
      <RoomForm></RoomForm>
      <RoomList></RoomList>
    </div>
  );
}
