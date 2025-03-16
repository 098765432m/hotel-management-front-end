"use client";

import styles from "@/styles/customer/hotel-detail/CommentSection.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import NextImage from "@/components/custom-component/NextImage";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import {
  RatingHotelApiResponse,
  RatingHotelPayload,
} from "@/types/dto/rating.dto";
import { Rating } from "@mantine/core";
import dayjs from "dayjs";
import MantineButton from "@/components/custom-component/MantineButton";
import { FaTrashAlt } from "react-icons/fa";
import CustomPopupConfirm from "@/components/custom-component/popup-confirm/CustomPopupConfirm";
import { useEffect, useState } from "react";
import ratingsService from "@/services/ratings.service";
import useSWR, { useSWRConfig } from "swr";
import { axiosCustomFetcher } from "@/lib/swr";

interface Props {
  hotelId: string;
  userId: string | null;
}

export default function CommentList(props: Props) {
  const { mutate } = useSWRConfig();
  const [confirmState, setConfirmState] = useState<{
    opened: boolean;
    ratingId: string | null;
  }>({ opened: false, ratingId: null });

  const { data: ratingApiResponse, mutate: ratingMutate } = useSWR(
    props.hotelId ? () => `/api/ratings/hotel/${props.hotelId}` : null,
    axiosCustomFetcher
  );

  const ratingData: RatingHotelPayload[] | null =
    ratingApiResponse?.success && ratingApiResponse?.data
      ? ratingApiResponse.data.ratings
      : null;

  return (
    <>
      <div className={styles.comment_list_container}>
        {ratingData &&
          ratingData.map((rating) => {
            return (
              <CardDefault key={rating.id} className={styles.comment_card}>
                <div className={styles.comment_card_left_section}>
                  <NextImage
                    height={50}
                    width={50}
                    src={
                      process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string
                    }
                    alt={rating.guest.full_name ?? "Ảnh đại diện"}
                  ></NextImage>
                  <div>{rating.guest.username}</div>
                  <div>
                    <Rating readOnly defaultValue={rating.score}></Rating>
                  </div>
                </div>

                <div className={styles.comment_card_right_section}>
                  {rating.comment && <div>{rating.comment}</div>}
                  <div className={styles.comment_card_right_section_bottom}>
                    <div>{dayjs(rating.updateAt).format("DD/MM/YYYY")}</div>{" "}
                    {rating.guest_id === props.userId && (
                      <div>
                        <MantineButton
                          color="red"
                          size="compact-xs"
                          onClick={() =>
                            setConfirmState({
                              opened: true,
                              ratingId: rating.id,
                            })
                          }
                        >
                          <FaTrashAlt size={8}></FaTrashAlt>
                        </MantineButton>
                      </div>
                    )}
                  </div>
                </div>
              </CardDefault>
            );
          })}
      </div>

      <CustomPopupConfirm
        opened={confirmState.opened}
        title={"Bạn có muốn xóa đánh giá không ?"}
        onOk={async () => {
          if (confirmState.ratingId) {
            await ratingsService.RemoveOne(
              confirmState.ratingId,
              props.hotelId
            );
            setConfirmState({ opened: false, ratingId: null });
            Promise.all([
              ratingMutate(),
              // mutate(`/api/ratings/hotel/cm7nesbro0004u1xcfiy0u1xu`),
              mutate(`/api/hotels/${props.hotelId}`),
              // mutate(`/api/ratings/hotel/${props.hotelId}`),
            ]);
          }
        }}
        onCancel={() => {
          setConfirmState({ opened: false, ratingId: null });
        }}
        okText="Đồng ý"
        cancelText="Hủy"
      ></CustomPopupConfirm>
    </>
  );
}
