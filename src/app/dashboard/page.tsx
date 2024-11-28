import CardDefault from "@/components/custom-component/CardDefault";
import HotelForm from "@/components/dashboard/hotel-form";
import { decrypt, SessionPayload } from "@/lib/session";
import { Hotel } from "@/types/hotel.interface";
import { addressToString } from "@/utils/helpers";
import axios from "axios";
import { cookies } from "next/headers";

async function getData(hotelId: string | null) {
  const hotel = (
    await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/hotels/${hotelId ?? ""}`
    )
  ).data;

  return hotel;
}

export default async function DashBoardPage() {
  const loginInfoString = cookies().get("login")?.value;
  const loginInfo = await decrypt(loginInfoString);

  const { userId, role, hotelId } = loginInfo as SessionPayload;
  console.log("info");

  // const hotel: Hotel = await getData(hotelId);

  return (
    <>
      {/* <div className="flex justify-around">
        <div className="">
          <h1>Thông tin khách sạn</h1>
          <div>
            <h1>Tên khách sạn: {hotel.name}</h1>
            <h3>Địa chỉ: {addressToString(hotel.address)}</h3>
            <h3>Số điện thoại</h3>
            {hotel.rooms != null && (
              <>
                <h3>Số phòng hiện tại: </h3>
                <h3>Số phòng trống: </h3>
                <h3></h3>
              </>
            )}
          </div>
        </div>
        <div>
          <h1>Nhân viên:</h1>
          <div>
            <h2>Số nhân viên</h2>
            <h2>Số tài khoản quản lý</h2>
          </div>
        </div>
      </div> */}
      <HotelForm></HotelForm>
    </>
  );
}
