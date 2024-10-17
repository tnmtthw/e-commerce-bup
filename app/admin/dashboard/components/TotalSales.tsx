"use client";
import { 
  Card, 
  CardBody,
 } from "@nextui-org/react";

const TotalSales = ({ totalSales }) => {
  return (
    <Card>
      <CardBody className="flex flex-col items-center justify-center h-full">

          <p className="text-5xl">
            ₱
            {totalSales.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        <p className="text-l text-default-500">Total Sales</p>
      </CardBody>
    </Card>
  );
}

export default TotalSales;
