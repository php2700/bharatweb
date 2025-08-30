// Accepted.jsx
import React from "react";
import Profile from "../../../assets/ViewProfile/Worker.png";

export default function Accepted({
  serviceProvider,
  assignedWorker,
  paymentHistory,
}) {
  if (!serviceProvider && !assignedWorker) {
    return null; // Don't render if no data is available
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Order Details (Assigned)</h2>

      {/* Service Provider Details */}
      {serviceProvider && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-2">Service Provider</h3>
          <div className="flex items-center space-x-4">
            <img
              src={serviceProvider.profile_pic || Profile}
              alt={`Profile of ${serviceProvider.full_name || "Worker"}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">
                {serviceProvider.full_name || "Unknown Worker"}
              </p>
              <p className="text-gray-600">
                Phone: {serviceProvider.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Worker Details */}
      {assignedWorker && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-2">Assigned Worker</h3>
          <div className="flex items-center space-x-4">
            <img
              src={assignedWorker.image || Profile}
              alt={`Profile of ${assignedWorker.name || "Worker"}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">
                {assignedWorker.name || "Unknown Worker"}
              </p>
              <p className="text-gray-600">
                Phone: {assignedWorker.phone || "N/A"}
              </p>
              <p className="text-gray-600">
                Aadhar: {assignedWorker.aadharNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      {paymentHistory && paymentHistory.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Payment History</h3>
          {paymentHistory.map((payment, index) => (
            <div
              key={payment._id}
              className="border-b border-gray-300 py-2 last:border-b-0"
            >
              <p>
                <span className="font-semibold">Payment {index + 1}:</span>{" "}
                ₹{payment.amount} (Tax: ₹{payment.tax})
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {payment.description}
              </p>
              <p>
                <span className="font-semibold">Method:</span> {payment.method}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {payment.status}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(payment.date).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Provider Earning:</span> ₹
                {payment.provider_earning}
              </p>
              <p>
                <span className="font-semibold">Commission:</span> ₹
                {payment.commission_amount} ({payment.commissionPercentage}%)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
