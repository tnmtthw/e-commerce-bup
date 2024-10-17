"use client";
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
import { useState } from "react";

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

export default function ShippedCard() {
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);
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

  const pendingOrders = orders.filter((order) => order.status === "Shipped");

  const handleUpdateStatus = async (orderId: number) => {
    setLoadingOrderId(orderId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order-received/${orderId}`,
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
        toast: true,
        position: "bottom-start",
        text: "Success",
        showConfirmButton: false,
        timer: 1000,
        background: "#28a745",
        color: "#ffffff",
      });

      await mutate();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
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
                <div key={item.id} className="grid grid-cols-3 gap-4">
                  <p>{`${index + 1}. ${item.product.name}`}</p>
                  <p>{`Qty: ${item.quantity}`}</p>
                  <p>{`Price: ₱${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                </div>
              ))}
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between">
              <p className="font-bold mt-2">
                Your order is on its way! It's currently with the delivery
                courier
              </p>
              <Button
                isLoading={loadingOrderId === order.id}
                color="primary"
                onClick={() => handleUpdateStatus(order.id)}
              >
                {loadingOrderId !== order.id && "Received"}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
