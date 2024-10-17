import React from "react";
import { Button } from "@nextui-org/button";

const HomeBanner = () => {
  return (
    <div className="relative bg-blue-500 text-white py-16 px-6 lg:px-20 mb-5 rounded-xl">
      <div className="absolute inset-0 opacity-30">
        <img
          alt="Sale Banner"
          className="w-full h-full object-cover"
          src="/images/banner-home.jpg"
        />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Massive Sale!</h1>
        <p className="text-lg mb-8">Up to 50% off on selected items.</p>
        <Button>Shop Now</Button>
      </div>
    </div>
  );
};

export default HomeBanner;
