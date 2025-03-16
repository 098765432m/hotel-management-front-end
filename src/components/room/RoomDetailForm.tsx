import { Input } from "antd";
import Card from "../custom-component/CardDefault";

export default function RoomDetailForm() {
  return (
    <Card>
      <div className="space-y-5">
        <div>
          <div className="font-bold text-xl">Thông tin khách hàng</div>
          <div className="text-xs text-gray-500">
            <i>
              Tên khách hàng phải phù hợp với giấy tờ tùy thân để nhận phòng.
            </i>
          </div>
        </div>
        <div className="w-full space-y-4">
          <div className="flex space-x-2">
            <span className="w-1/2 space-y-1">
              <div>Họ</div>
              <div>
                <Input placeholder="Họ"></Input>
              </div>
            </span>
            <span className="w-1/2 space-y-1">
              <div>Tên</div>
              <Input placeholder="Tên"></Input>
            </span>
          </div>
          <div className="flex space-x-2">
            <span className="w-1/2 space-y-1">
              <div>Email</div>
              <Input placeholder="Email"></Input>
            </span>
            <span className="w-1/2 space-y-1">
              <div>Số điện thoại</div>
              <Input placeholder="Số điện thoại"></Input>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
