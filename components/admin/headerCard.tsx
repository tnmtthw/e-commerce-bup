// HeaderCard.tsx

"use client";

import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Link from "next/link";

interface HeaderCardProps {
  btnName: string;
  url: string;
  className: string;
}

export default function HeaderCard({
  btnName,
  url,
  className,
}: HeaderCardProps) {
  return (
    <Card className="mb-5" radius="sm">
      <CardBody className="flex items-end">
        <Button className={className}>
          <Link href={url}>{btnName}</Link>
        </Button>
      </CardBody>
    </Card>
  );
}
