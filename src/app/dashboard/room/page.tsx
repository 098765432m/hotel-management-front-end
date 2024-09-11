"use client";

import CardDefault from "@/components/CardDefault";
import { axiosFetcher } from "@/lib/fetcher";
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
import useSWR from "swr";

export default function RoomPage() {
  const [selectedRoomType, setSelectedRoomType] = useState<String>("");
  const {
    data: roomType,
    isLoading: roomTypeLoading,
    error: roomTypeError,
  } = useSWR(`${process.env.NEXT_PUBLIC_APP_URL}/api/roomTypes`, axiosFetcher);

  console.log(`${process.env.NEXT_PUBLIC_APP_URL}/api/roomTypes`);

  if (roomTypeLoading != true) {
    console.log(roomType);
  }
  return (
    <CardDefault>
      <form>
        <div className="flex justify-center my-12">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="text-2xl font-bold">Phòng</div>
            </div>
            <div>
              <TextField variant="outlined" label="Tên phòng"></TextField>
            </div>
            <div>
              <TextField
                multiline
                variant="outlined"
                label="Miêu tả"
              ></TextField>
            </div>
            <div>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="roomType">Loại phòng</InputLabel>
                <Select
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
            <div className="flex justify-center">
              <Button variant="contained">Tạo phòng</Button>
            </div>
          </div>
        </div>
      </form>
    </CardDefault>
  );
}
