"use client";

import CardDefault from "@/components/custom-component/CardDefault";

interface Props {
  index: number;
  name: string;
}
export default function ProvinceCard({ name, index }: Props) {
  return (
    <CardDefault>
      <span>
        {index + 1}. {name}
      </span>
    </CardDefault>
  );
}
