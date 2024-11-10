"use client";

import CardDefault from "@/components/CardDefault";
import { Input, InputNumber, Button, Form } from "antd";
import { CldUploadWidget } from "next-cloudinary";

export default function RoomTypePage() {
  return (
    <CardDefault>
      <Form>
        <div className="flex justify-center my-12">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="text-2xl font-bold">Loại phòng</div>
            </div>
            <div>
              <Form.Item label="Ten loai">
                <Input></Input>
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Gia loai">
                <InputNumber></InputNumber>
              </Form.Item>
            </div>
            <div className=" flex justify-center">
              {/* Gui File */}
              <CldUploadWidget
                signatureEndpoint={`/api/sign-cloudinary-params`}
                onSuccess={() => {}}
              >
                {({ open }) => {
                  return <Button onClick={() => open()}>Upload</Button>;
                }}
              </CldUploadWidget>
            </div>
            <div className="flex justify-center">
              <Button>Tạo loại phòng</Button>
            </div>
          </div>
        </div>
      </Form>
    </CardDefault>
  );
}
