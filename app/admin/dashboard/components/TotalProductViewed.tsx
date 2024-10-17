"use client";
import { 
  Card,
   CardBody,
  } from "@nextui-org/react";


const TotalProductViewed = ({ productClickCount }) => {
  return (
    <Card>
      <CardBody className="flex flex-col items-center justify-center h-full">
          <p className="text-5xl">{productClickCount}</p>
        <p className="text-l text-default-500">Product viewed</p>
      </CardBody>
    </Card>
  );
}

export default TotalProductViewed;
