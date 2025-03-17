"use client";

import React from "react";
import NextLink from "./NextLink";
import { usePathname } from "next/navigation";
import { pathNameEnum } from "@/types/enum/pathName.enum";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function CustomBreadCrumbs({ ...restProps }: Props) {
  const pathName = usePathname();

  const pathNameSegments = pathName.split("/").filter(Boolean);

  const getLabel = (segment: string) => {
    return pathNameEnum[segment as keyof typeof pathNameEnum] || segment;
  };

  let segmentUrl = "/";
  return (
    <div {...restProps}>
      <span>
        <NextLink href={"/"}>Trang chủ </NextLink>
      </span>
      {pathNameSegments.length > 0 &&
        pathNameSegments
          .filter((segment) => Object.keys(pathNameEnum).includes(segment))
          .map((segment, index) => {
            segmentUrl.concat(`${segment}/`);
            return (
              <span key={index}>
                {"->"} <NextLink href={segment}>{getLabel(segment)} </NextLink>
              </span>
            );
          })}
    </div>
  );
}
