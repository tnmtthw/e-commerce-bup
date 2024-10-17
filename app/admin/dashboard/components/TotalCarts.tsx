"use client";
import { 
  Card, 
  CardBody, 
} from "@nextui-org/react";


const TotalCarts = ({ cartItemCount }) => {
  return (
    <Card>
      <CardBody className="flex flex-col items-center justify-center h-full">
          <p className="text-5xl">{cartItemCount}</p>

        <p className="text-l text-default-500">Product added to cart</p>
      </CardBody>
    </Card>
  );
}

export default TotalCarts;
