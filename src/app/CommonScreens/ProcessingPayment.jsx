import React from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Main from "../../assets/processingPayment/image1.svg";
import Main1 from "../../assets/processingPayment/1.svg";
import Main2 from "../../assets/processingPayment/2.svg";
import Main3 from "../../assets/processingPayment/3.svg";

export default function Payment() {
  return (
    <>
    <Header/>
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {/* Main Image with small icons */}
      <div className="relative">
        {/* Tablet / Checkout image */}
        <img src={Main} alt="Checkout" className="w-50 md:w-55" />

        {/* Lock icon (top-right) */}
        <img
          src={Main1}
          alt="Lock"
          className="absolute -top-5 right-[-50px] w-15"
        />

        {/* Card icon (middle-right) */}
        <img
          src={Main2}
          alt="Card"
          className="absolute top-15 right-[-50px] w-15"
        />

        {/* Coin icon (bottom-right) */}
        <img
          src={Main3}
          alt="Coin"
          className="absolute top-35 right-[-50px] w-15"
        />
      </div>

      {/* Text section */}
      <h2 className="mt-6 text-3xl font-bold text-black">
        Processing Your Payment
      </h2>
      <p className="mt-2 text-gray-700 text-lg">
        Please wait while we complete the transaction securely
      </p>
    </div>
    <Footer/>
    </>
  );
}
