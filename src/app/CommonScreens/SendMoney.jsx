import {useEffect} from "react";
import { Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Arrow from "../../assets/profile/arrow_back.svg";

export default function SendMoney() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
    <Header/>
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold text-xl"
        >
          <img src={Arrow} className="w-9 h-9 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Send Money Layout */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white shadow-lg rounded-xl p-9 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mt-10 tracking-tight">Send Money</h2>
          <p className="text-gray-500 mt-1 text-xl font-500 tracking-tight">Enter amount to send</p>

          {/* Input */}
          <input
            type="number"
            placeholder="Enter Amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 placeholder:text-xl mt-5 "
          />

          {/* Balance Info */}
          <p className="text-black mt-3 text-xl tracking-tight">
            Available Balance :{" "}
            <span className="text-[#008000] font-semibold">₹ 500</span>
          </p>

          {/* Submit Button */}
          <button className="w-full bg-[#008000] hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition mt-14 text-xl">
            Submit
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
}
