"use client";
import {
  Card,
  CardBody,
  Image
} from "@nextui-org/react";

interface Product {
  image_path: string;
  name: string;
}

interface MostProductViewedProps {
  mostClickProduct: {
    product: Product;
    click_count: number;
  };
}

const MostProductViewed = ({ mostClickProduct }: MostProductViewedProps) => {
  const { product, click_count } = mostClickProduct;

  return (
    <Card className="h-100">
      <CardBody>
        <div className="text-center">
          <Image
            className="object-cover"
            width={400}
            height={230}
            src={product.image_path}
            alt={product.name}
          />
          <p className="text-3xl">{product.name}</p>
          <p className="text-l text-default-500">Top Viewed Product</p>
          <p className="text-sm text-gray-500">
            Viewed {click_count} times
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default MostProductViewed;