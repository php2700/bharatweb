import { useDispatch, useSelector } from "react-redux";
import { toggleRole } from "../redux/roleSlice";
import { CheckCircle } from "lucide-react";

export default function RoleSelection() {
  const dispatch = useDispatch();
  const selectedRoles = useSelector((state) => state.role.selectedRoles);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] pb-40">
        {/* Title */}
        <h2 className="text-[22px] font-bold text-gray-800">
          Select Your Role
        </h2>
        <p className="text-[16px] text-gray-500 font-medium mt-1">
          Please choose whether you are a Worker or a <br /> Customer to proceed
        </p>

        {/* Role Options */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 mt-6">
          {/* Business */}
          <div
            onClick={() => dispatch(toggleRole("business"))}
            className={`flex flex-col items-center cursor-pointer transition-transform ${
              selectedRoles.includes("business") ? "scale-105" : ""
            }`}
          >
            <div className="relative">
              <div
                className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-4 bg-white shadow-[0px_2px_1px_1px_#bab1b1] ${
                  selectedRoles.includes("business")
                    ? "border-green-600"
                    : "border-transparent"
                }`}
              >
                <img
                  src="/src/assets/selection/business.png"
                  alt="Business"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-[82px]"
                />
              </div>

              {/* ✅ checkmark icon */}
              {selectedRoles.includes("business") && (
                <CheckCircle
                  size={20}
                  className="absolute bottom-1 right-7 rounded-full p-[3px] bg-[#228B22] stroke-white"
                />
              )}
            </div>
            <p className="mt-2 font-medium text-lg sm:text-xl text-black drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]">
              Business
            </p>
          </div>

          {/* Customer */}
          <div
            onClick={() => dispatch(toggleRole("customer"))}
            className={`flex flex-col items-center cursor-pointer transition-transform ${
              selectedRoles.includes("customer") ? "scale-105" : ""
            }`}
          >
            <div className="relative">
              <div
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-4 bg-white shadow-[0px_2px_1px_1px_#bab1b1] ${
                  selectedRoles.includes("customer")
                    ? "border-green-600"
                    : "border-transparent"
                }`}
              >
                <img
                  src="/src/assets/selection/customer.png"
                  alt="Customer"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-[82px]"
                />
              </div>

              {/* ✅ checkmark icon */}
              {selectedRoles.includes("customer") && (
                <CheckCircle
                  size={20}
                  className="absolute bottom-1 right-7 rounded-full p-[3px] bg-[#228B22] stroke-white"
                />
              )}
            </div>
            <p className="mt-2 font-medium text-lg sm:text-xl drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]">
              Customer
            </p>
          </div>
        </div>

        {/* Sub Text */}
        <p className="mt-6 text-[17px] text-gray-500 font-medium">
          Looking For Hiring
        </p>

        {/* Button */}
        <button className="mt-[67px] w-full sm:w-80 bg-[#228B22] text-white py-3 rounded-[15px] font-semibold hover:bg-green-700 transition">
          Continue As{" "}
          {selectedRoles.length > 0 ? selectedRoles.join(" & ") : "None"}
        </button>
      </div>
    </div>
  );
}
