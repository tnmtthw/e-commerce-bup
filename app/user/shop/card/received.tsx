import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Avatar,
} from "@nextui-org/react";
import useSWR from "swr";
import ReceivedReviewProduct from "@/app/user/shop/card/receivedReviewProduct";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    description: string;
    image_path: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  order_items: OrderItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReceivedCard() {
  const userId = localStorage.getItem("userId");
  const { data: orders, error } = useSWR<Order[]>(
    userId ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-orders/${userId}` : null,
    fetcher,
  );

  if (error) return <div>Error loading order.</div>;
  if (!orders) return <div>Loading...</div>;

  const pendingOrders = orders.filter((order) => order.status === "Received");

  return (
    <div className="grid grid-cols-1 gap-4">
      {pendingOrders.length === 0 ? (
        <div>No pending orders.</div>
      ) : (
        pendingOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex justify-between">
              <p className="text-small text-default-500">
                Order Number: {order.id}
              </p>
              <p className="font-bold mt-2">{`Total Price: ₱${order.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
            </CardHeader>
            <Divider />
            <CardBody>
              {order.order_items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-4 gap-4">
                  <p>{`${index + 1}. ${item.product.name}`}</p>
                  <Gallery withDownloadButton>
                    <Item
                      original={item.product.image_path}
                      height="500"
                      width="500"
                    >
                      {({ ref, open }) => (
                        <Avatar
                          ref={ref}
                          onClick={open}
                          isBordered
                          radius="sm"
                          src={item.product.image_path}
                          className="object-cover cursor-pointer"
                        />
                      )}
                    </Item>
                  </Gallery>
                  <div className="flex justify-center items-center p-1 h-full">
                    <ReceivedReviewProduct
                      productId={item.product_id}
                      userId={parseInt(userId!)}
                    />
                  </div>
                  <div className="flex justify-center items-center p-1 h-full">
                    <p>{`Qty: ${item.quantity}`}</p>
                  </div>
                  <p>{`Price: ₱${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                </div>
              ))}
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between">
              <p className="font-bold mt-2">
                Thank you for shopping with us! We hope you enjoy your product!
              </p>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
