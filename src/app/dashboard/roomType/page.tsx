import CardDefault from "@/components/CardDefault";
import { Button, TextField } from "@mui/material";

export default function RoomTypePage() {
  return (
    <CardDefault>
      <form>
        <div className="flex justify-center my-12">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="text-2xl font-bold">Loại phòng</div>
            </div>
            <div>
              <TextField variant="outlined" label="Tên loại phòng"></TextField>
            </div>
            <div>
              <TextField variant="outlined" label="Giá loại phòng"></TextField>
            </div>
            <div>
              <TextField variant="outlined" label="Đường dẫn url"></TextField>
            </div>
            <div className="flex justify-center">
              <Button variant="contained">Tạo loại phòng</Button>
            </div>
          </div>
        </div>
      </form>
    </CardDefault>
  );
}
