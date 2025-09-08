import React from "react";
import money from "../../assets/login/money.png";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from "../../assets/profile/banner.png";
export default function Notifications() {
  const notifications = [
    {
      section: "Today",
      items: [
        {
          title: "Payment Confirmed",
          message: "Your payment of ₹500 has been confirmed.",
        },
      ],
    },
    {
      section: "Yesterday",
      items: [
        {
          title: "Payment Confirmed",
          message: "Your payment of ₹500 has been confirmed.",
        },
        {
          title: "Payment Confirmed",
          message: "Your payment of ₹500 has been confirmed.",
        },
      ],
    },
    {
      section: "15 November 2024",
      items: [
        {
          title: "Payment Confirmed",
          message: "Your payment of ₹500 has been confirmed.",
        },
        {
          title: "Payment Confirmed",
          message: "Your payment of ₹500 has been confirmed.",
        },
        {
          title: "Payment Confirmed",
          message: "Your payment of ₹500 has been confirmed.",
        },
      ],
    },
  ];

  return (
     <>
      <Header />
    <div className="max-w-[56rem] mx-auto bg-white shadow-md rounded-lg border border-gray-200 mt-10">
        <h4 className="text-center mt-4 text-[20px]">Notifications</h4>
      <div className="divide-y">
        
        {notifications.map((section, i) => (
          <div key={i} className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              {section.section}
            </h3>
            {section.items.map((notif, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {/* Coin Image */}
                  <img
                    src={money}
                    alt="coin"
                    className="w-10 h-10 rounded-full"
                  />
                  {/* Texts */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500">{notif.message}</p>
                  </div>
                </div>
                {/* View Button */}
                <button className="text-green-600 text-sm font-medium border border-green-600 px-3 py-1 rounded-lg">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>


      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
