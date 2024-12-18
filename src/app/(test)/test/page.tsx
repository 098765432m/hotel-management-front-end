"use client";
import { Button, Center, Skeleton } from "@mantine/core";
import { useFullscreen, useHotkeys, useHover, useToggle } from "@mantine/hooks";
import dayjs from "dayjs";
import { useState } from "react";

export default function Demo() {
  const [value, toggle] = useToggle(["loading", "done"]);
  console.log(dayjs("2024-12-24T00:00:00+07:00").toISOString());

  return (
    <>
      {value === "done" ? (
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolor
          nihil amet tempore magnam optio, numquam nostrum inventore tempora
          assumenda saepe, aut repellat. Temporibus aspernatur aperiam magnam
          debitis facere odio? Laborum fuga quam voluptas aut pariatur delectus
          repudiandae commodi tempora debitis dolores vero cumque magni cum,
          deserunt, ad tempore consectetur libero molestias similique nemo eum!
          Dolore maxime voluptate inventore atque.
        </div>
      ) : (
        <>
          <Center>
            <Skeleton height={50} mb={"xl"} mt={"xl"} circle></Skeleton>
          </Center>
          <Skeleton height={20} mb={"xl"}></Skeleton>
          <Skeleton height={20} mb={"xl"}></Skeleton>
          <Skeleton height={20} mb={"xl"}></Skeleton>
        </>
      )}

      <Center>
        <Button variant="filled" color="blue" onClick={() => toggle()}>
          {value === "loading" ? `Xong chua ?` : `Khoi dong!`}
        </Button>
      </Center>
    </>
  );
}
