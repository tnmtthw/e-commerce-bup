"use client";
import {
  Card,
  CardBody,
  Image
} from "@nextui-org/react";

const MostProductOrdered = ({ mostOrderedProduct }) => {

  const { product, click_count } = mostOrderedProduct;

  return (
    <Card className="h-100">
      <CardBody>
        <div className="text-center">
          <>
            <>
              <Image
                className="object-cover"
                width={400}
                height={230}
                src={product.image_path}
                alt={product.name}
              />
              <p className="text-3xl">{product.name}</p>
              <p className="text-l text-default-500">Top Ordered Product</p>
              <p className="text-sm text-gray-500">
                Ordered {click_count} times
              </p>
            </>
          </>
        </div>
      </CardBody>
    </Card>
  );
}

export default MostProductOrdered;