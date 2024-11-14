import FormStaff from "@/components/dashboard/Staff/form-staff";
import ListStaff from "@/components/dashboard/Staff/list-staff";

export default function StaffPage() {
  return (
    <div className="flex my-4">
      <div className=" w-1/2">
        <FormStaff></FormStaff>
      </div>
      <div className=" w-1/2">
        <ListStaff></ListStaff>
      </div>
    </div>
  );
}
