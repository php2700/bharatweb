import Header from "../../../component/Header";
import banner from "../../../assets/banner.png";
import Footer from "../../../component/footer";
import paymentImg from "../../../assets/directHiring/payment.png";

export default function PaymentConfirmation() {
  return (
    <>
      <Header />
      <div className="min-h-screen p-4  bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="max-w-2xl mx-auto py-10 mt-6 rounded-lg shadow-xl bg-white">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-6">Payment Confirmation</h2>

            <img src={paymentImg} alt="Payment" className="h-48 mx-auto mb-6" />

            <div className="space-y-3 px-8 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>01/24/2026</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>10:15 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>0 RS</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Platform fees:</span>
                <span>200 INR</span>
              </div>
            </div>

            <hr className="my-6 dotted" />

            <div className="flex justify-between text-lg font-semibold mb-6 max-w-md mx-auto px-8">
              <span>Total</span>
              <span>200/-</span>
            </div>
            <hr className="my-6 text-[#228B22]" />

            <div className="flex gap-4 justify-center mt-6 w-full">
              <button className="px-4 py-2 bg-[#228B22] w-1/4 text-white rounded-md hover:bg-green-700 transition">
                Pay
              </button>
              <button className="px-4 py-2 border border-[#228B22] w-1/4 text-green-600 rounded-md hover:bg-green-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 my-10">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
