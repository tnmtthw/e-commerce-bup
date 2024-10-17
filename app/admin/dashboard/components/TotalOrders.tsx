"use client";
import { 
  Card, 
  CardBody, 
} from "@nextui-org/react";

interface TotalOrdersProps {
  orderCount: number;
}


const TotalOrders = ({ orderCount } : TotalOrdersProps) => {
  return (
    <Card>
      <CardBody className="flex flex-col items-center justify-center h-full">

          <p className="text-5xl">{orderCount}</p>
        <p className="text-l text-default-500">Product check out</p>
      </CardBody>
    </Card>
  );
}

export default TotalOrders;
