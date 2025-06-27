import { prisma } from "@/lib/client";

export async function DELETE(
  request: Request,
  { params }: { params: { maintenanceId: string } }
) {
  const maintenanceId = params.maintenanceId;

  await prisma.maintenance.delete({
    where: {
      id: maintenanceId,
    },
  });
}
