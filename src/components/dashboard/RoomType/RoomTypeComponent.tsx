"use client";
import CardDefault from "@/components/custom-component/CardDefault";
import styles from "@/styles/dashboard/room-type/RoomType.module.scss";
import RoomTypeForm from "./RoomTypeForm";
import RoomTypeList from "./RoomTypeList";
import { SessionPayload } from "@/lib/session";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import { RoomTypeHotelApiResponse } from "@/types/dto/room-types.dto";

interface Props {
  loginInfo: SessionPayload;
}

export default function RoomTypeComponent(props: Props) {
  const { mutate: roomTypeMutate } =
    useCustomSWRInfinite<RoomTypeHotelApiResponse>(
      props.loginInfo?.hotelId
        ? `/api/roomTypes/hotel/${props.loginInfo.hotelId}?limit=6`
        : null
    );
  return (
    <div className={styles.room_type_container}>
      <CardDefault>
        <RoomTypeForm roomTypeMutate={roomTypeMutate}></RoomTypeForm>
      </CardDefault>

      <CardDefault>
        <RoomTypeList hotelId={props.loginInfo?.hotelId ?? null}></RoomTypeList>
      </CardDefault>
    </div>
  );
}
