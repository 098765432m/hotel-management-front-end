import { z } from "zod";

export default async function ZodTestField() {
  const myString = z.object({
    username: z.string(),
  });

  console.log(
    myString.safeParse({
      username: "le name",
    })
  );

  console.log(
    myString.safeParse({
      username: 0,
    })
  );

  console.log("type");

  type TypedString = z.infer<typeof myString>;

  return <></>;
}
