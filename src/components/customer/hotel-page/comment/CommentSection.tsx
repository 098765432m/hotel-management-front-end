import styles from "@/styles/customer/hotel-detail/CommentSection.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { Rating, Textarea } from "@mantine/core";
import { useState } from "react";
import CommentList from "./CommentList";
import { Form as MantineForm, useForm } from "@mantine/form";
import ratingsService from "@/services/ratings.service";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useSWRConfig } from "swr";

interface Props {
  hotelId: string;
}

export default function CommentSection(props: Props) {
  const { mutate, cache } = useSWRConfig();
  const userId = useSelector((state: RootState) => state.auth.authInfo?.id);
  const ratingForm = useForm<{
    addRatingScore: number;
    addRatingComment?: string;
  }>({
    initialValues: {
      addRatingScore: 0,
      addRatingComment: undefined,
    },
  });
  const [rating, setRating] = useState<number>(0);

  // Handle Event

  const handleSubmit = async () => {
    const ratingFormData = ratingForm.getValues();

    if (userId && ratingFormData.addRatingScore > 0) {
      await ratingsService.createOne(props.hotelId, {
        guestId: userId,
        score: ratingFormData.addRatingScore,
        comment: ratingFormData.addRatingComment ?? null,
      });

      Promise.all([
        mutate(`/api/hotels/${props.hotelId}`),
        mutate(`/api/ratings/hotel/${props.hotelId}`),
      ]);
    }
  };

  // Handle Event End

  return (
    <CardDefault className={styles.comment_section_container}>
      <div className={styles.comment_section_heading}>Đánh giá</div>

      <div className={styles.comment_section_layout}>
        <MantineForm form={ratingForm} onSubmit={handleSubmit}>
          <div className={styles.comment_input_container}>
            <Textarea
              placeholder="Gửi nhận xét!"
              resize="vertical"
              autosize
              minRows={4}
              maxRows={8}
              {...ratingForm.getInputProps("addRatingComment")}
              className={styles.comment_input}
            ></Textarea>
            <div className={styles.rating_container}>
              <Rating
                size="lg"
                value={rating}
                {...ratingForm.getInputProps("addRatingScore")}
                onChange={(value: number) => {
                  setRating(value);
                  ratingForm.setFieldValue("addRatingScore", value);
                }}
              ></Rating>
              <MantineButton type="submit">Đánh giá</MantineButton>
            </div>
          </div>
        </MantineForm>
        <CommentList
          userId={userId ?? null}
          hotelId={props.hotelId}
        ></CommentList>
      </div>
    </CardDefault>
  );
}
