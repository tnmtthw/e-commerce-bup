import React from "react";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import Link from "next/link";

const EmptyCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center h-full p-4">
      <Image
        className=""
        src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
        width="100%"
      />
      <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
      <p className="mb-4">
        It seems you haven't added anything to your cart yet. Start shopping
        now!
      </p>
      <Link href="/user/">
        <Button color="primary" size="lg">
          Shop Now
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCard;
