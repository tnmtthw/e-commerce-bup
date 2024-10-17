import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
} from "@nextui-org/react";
import useSWR from "swr";
import Swal from "sweetalert2";

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

const handleUpdateStatus = async (orderId: number, mutate: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Received" }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update the order");
    }
    Swal.fire({
      position: "bottom-start",
      text: "Received Successfully",
      showConfirmButton: false,
      timer: 1000,
      background: "#28a745",
      color: "#ffffff",
    });
    mutate();
  } catch (error) {
    console.error(error);
  }
};

export default function OrderCard() {
  const userId = localStorage.getItem("userId");
  const {
    data: orders,
    error,
    mutate,
  } = useSWR<Order[]>(
    userId ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-orders/${userId}` : null,
    fetcher,
  );

  if (error) return <div>Error loading order.</div>;
  if (!orders) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4 pt-2">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex justify-between">
            <p className="text-small text-default-500">
              Order Number : {order.id}
            </p>
            <p className="mt-2 font-bold">{`Total Price: ₱${order.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
          </CardHeader>
          <Divider />
          <CardBody>
            {order.order_items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-3 gap-4">
                <p>{`${index + 1}. ${item.product.name}`}</p>
                <p>{`Qty: ${item.quantity}`}</p>
                <p>
                  {`Price: ₱${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}{" "}
                </p>
              </div>
            ))}
          </CardBody>
          asdadsads asdasd
          <Divider />
          {(() => {
            switch (order.status) {
              case "Received":
                return (
                  <div className="text-center bg-blue-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                    Received
                  </div>
                );
              case "Shipped":
                return (
                  <div className="text-center bg-cyan-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                    Shipped
                  </div>
                );
              case "Paid":
                return (
                  <div className="text-center bg-teal-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                    Paid
                  </div>
                );
              case "Pending":
                return (
                  <div className="text-center bg-purple-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                    Pending
                  </div>
                );
              default:
                return null;
            }
          })()}
        </Card>
      ))}
    </div>
  );
}
