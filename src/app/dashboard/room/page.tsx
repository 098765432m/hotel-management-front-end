"use client";
import { roomCreate } from "@/action/room.action";
import CardDefault from "@/components/custom-component/CardDefault";
import { axiosFetcher } from "@/lib/fetcher";
import { RootState } from "@/state/store";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { RoomTypes } from "@prisma/client";
import { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";

export default function RoomPage() {
  const authStore = useSelector((state: RootState) => state.auth.authInfo);
  const [selectedRoomType, setSelectedRoomType] = useState<String>("");
  const {
    data: roomType,
    isLoading: roomTypeLoading,
    error: roomTypeError,
  } = useSWR(`${process.env.NEXT_PUBLIC_APP_URL}/api/roomTypes`, axiosFetcher);

  return (
    <CardDefault>
      <form action={roomCreate}>
        <div className="flex justify-center my-12">
          <div className="space-y-4 grid justify-items-center ">
            <div className="flex justify-center">
              <div className="text-2xl font-bold">Phòng</div>
            </div>
            <div>
              <TextField
                name="roomName"
                variant="outlined"
                label="Tên phòng"
              ></TextField>
            </div>
            <div>
              <TextField
                name="description"
                multiline
                variant="outlined"
                label="Miêu tả"
              ></TextField>
            </div>
            <div>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="roomType">Loại phòng</InputLabel>
                <Select
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  name="roomType"
                  value={selectedRoomType}
                  label="Mokas"
                  labelId="roomType"
                >
                  {roomType && roomType.length > 0 ? (
                    roomType.map((type: RoomTypes) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">Chọn loại phòng</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
            <input
              type="hidden"
              value={authStore?.hotelId as string}
              name="hotelId"
            ></input>
            <div className="flex justify-center">
              <Button variant="contained" type="submit">
                Tạo phòng
              </Button>
            </div>
          </div>
        </div>
      </form>
    </CardDefault>
  );
}
