"use client";

import React, { useRef } from "react";
import { Button } from "@nextui-org/button";
import html2pdf from "html2pdf.js";
import { DownloadIcon, PrintIcon } from "@/components/user/icons";

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
  name: string;
  address: string;
  phone: string;
  payment: string;
  total_price: number;
  status: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface InvoiceProps {
  order: Order;
}

const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Function to download as PDF
  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      const element = invoiceRef.current;
      const options = {
        margin: 0.5,
        filename: `invoice_${order.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().from(element).set(options).save();
    }
  };

  return (
    <div>
      {/* Buttons to Print or Download PDF */}
      <div className="flex justify-start space-x-1 mb-4">
        <Button
          startContent={<PrintIcon />}
          size="sm"
          color="primary"
          onPress={handlePrint}
        >
          Print
        </Button>
        <Button
          startContent={<DownloadIcon />}
          size="sm"
          color="secondary"
          onPress={handleDownloadPDF}
        >
          Download as PDF
        </Button>
      </div>
      {/* Invoice Content */}
      <div ref={invoiceRef} className="p-6 bg-white dark:bg-white">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-black">
          Invoice #{order.id}
        </h2>

        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-black">
            Customer Information
          </h3>
          <p className="dark:text-black">
            <strong>Name:</strong> {order.name}
          </p>
          <p className="dark:text-black">
            <strong>Address:</strong> {order.address}
          </p>
          <p className="dark:text-black">
            <strong>Phone:</strong> {order.phone}
          </p>
        </div>

        {/* Order Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-black">
            Order Information
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="dark:text-black border border-gray-300 px-2 py-1">
                  Product
                </th>
                <th className="dark:text-black border border-gray-300 px-2 py-1">
                  Quantity
                </th>
                <th className="dark:text-black border border-gray-300 px-2 py-1">
                  Price
                </th>
                <th className="dark:text-black border border-gray-300 px-2 py-1">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-2 py-1 text-black dark:text-black">
                    {item.product.name}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-black dark:text-black">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-black dark:text-black">
                    ₱{" "}
                    {item.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-black dark:text-black">
                    ₱{" "}
                    {(item.price * item.quantity).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment and Total */}
        <div className="mt-4 text-black dark:text-black">
          <p>
            <strong>Payment Method:</strong> GCASH
          </p>
          <p>
            <strong>Total Price:</strong> ₱{" "}
            {order.total_price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Date and Status */}
        <div className="mt-6 text-black dark:text-black">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.updated_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
