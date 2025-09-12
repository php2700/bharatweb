import image from "../../../assets/workcategory/image.png";
import warningImg from "../../../assets/directHiring/warning.png";
import callIcon from "../../../assets/directHiring/call.png";
import messageIcon from "../../../assets/directHiring/message.png";
import {useEffect} from "react";

export default function Accepted() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between border bg-gray-100  border-[#228B22] rounded-lg p-4">
          <div className="flex items-center gap-4">
            <img
              src={image}
              alt="Mohan Sharma"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">Mohan Sharma</h4>
              <p className="text-sm text-gray-600">
                Project Fees - <span className="font-medium">₹200/-</span>
              </p>
              <button className="bg-[#228B22] text-white px-6 py-1 rounded-lg text-sm mt-2">
                View Profile
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="font-medium mb-2">Contact with him</p>
            <div className="flex gap-3 justify-center">
              <button className="p-2 bg-gray-200 rounded-full">
                <img src={callIcon} className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-200 rounded-full">
                <img src={messageIcon} className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center ">
            <p className="mt-2 bg-[#228B22] text-white px-3  text-md rounded-lg py-1 font-medium">
              Accepted by worker
            </p>
          </div>
        </div>

        <div className="border  border-[#228B22] bg-gray-100 rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Payment</h3>
            <button className="bg-[#228B22] text-white px-4 py-1 rounded-lg text-sm">
              Create Payment
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between bg-white py-3 px-6 items-center pb-2">
              <span className="font-semibold">1.</span>
              <span className="font-semibold "> Starting Payment</span>
              <span className="text-[#228B22] text-md">Paid</span>
              <span className="font-semibold">₹20,000</span>
            </div>

            <div className="flex justify-between items-center bg-white py-3 px-6 pb-2">
              <span className="font-semibold">2</span>
              <span className="font-semibold "> Starting Payment</span>
              <button className="bg-[#228B22] border rounded-lg px-4 text-white py-1 text-md">
                Pay
              </button>
              <span className="font-semibold">₹20,000</span>
            </div>

            <div className="  bg-white py-3 px-6">
              <div className="flex items-center gap-3">
                <span className="font-semibold">3</span>
                <input
                  type="text"
                  placeholder="Enter Description"
                  className="flex-1 border border-[#228B22] rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Enter Amount"
                  className="w-40 border  border-[#228B22] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3 justify-center mt-3">
                <button className="bg-[#228B22] text-white px-4 py-2 rounded-lg text-sm">
                  Submit
                </button>
                <button className=" text-[#228B22] border px-4 py-2 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto my-25">
          <img
            src={warningImg}
            alt="Warning"
            className="absolute left-1/2 -translate-x-1/2 -top-[35%]  md:-top-[42%] lg:-top-[45%] w-60 h-auto"
          />
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg shadow-md p-6 pt-30 text-center">
            <h4 className="text-red-600 font-semibold text-lg">
              Warning Message
            </h4>
            <p className="text-lg text-gray-700 mt-2 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s...
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button className="bg-[#228B22] text-white px-6 py-3 rounded-lg font-medium">
            Mark as complete
          </button>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium">
            Cancel Task and create dispute
          </button>
        </div>
      </div>
    </>
  );
}
