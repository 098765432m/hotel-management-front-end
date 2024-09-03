import Button from "@/components/Button";
import Card from "@/components/Card";
import bookingsService from "@/services/bookings.service";
import { Booking } from "@/types/booking.interfaces";
import moment from "@/lib/moment";

export default async function AdminHome() {
  const bookings: Booking[] = await bookingsService.getAll();

  if (bookings == undefined) return <div></div>;
  return (
    <div>
      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-center px-8">
            <div className="text-2xl font-semibold">Booking</div>
            <div>
              <Button>Create Booking</Button>
            </div>
          </div>
          <div>
            <div className="">
              <table className="w-full border-2 border-gray-200">
                <thead className=" border-b-2 border-gray-200">
                  <tr>
                    <th className="font-normal">Stt</th>
                    <th className="font-normal">id</th>
                    <th className="font-normal">Phòng</th>
                    <th className="font-normal">Tên khách</th>
                    <th className="font-normal">Ngày thuê</th>
                    <th className="font-normal">Ngày trả</th>
                    <th className="font-normal">trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking: Booking, index: number) => (
                      <tr key={index} className="border-b-2 border-gray-200">
                        <th className="py-8">{index + 1}</th>
                        <th>{booking.id}</th>
                        <th>{booking.room_id}</th>
                        <th>{booking.user_name}</th>
                        <th>{moment(booking.check_in_date).format("lll")}</th>
                        <th>{moment(booking.check_out_date).format("lll")}</th>
                        <th>{booking.status ? 1 : 0}</th>
                      </tr>
                    ))
                  ) : (
                    <div></div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
