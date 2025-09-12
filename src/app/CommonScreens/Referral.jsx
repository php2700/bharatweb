import {useEffect} from "react";
import Cartoon from "../../assets/Referral/cartoon.svg";

export default function Referral() {
  const referralCode = "568500";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const referralList = [
    { id: 1, name: "Ram Sharma", date: "05/15/25", amount: "Rs. 200/-" },
    { id: 2, name: "Ram Sharma", date: "05/15/25", amount: "Rs. 200/-" },
    { id: 3, name: "Ram Sharma", date: "05/15/25", amount: "Rs. 200/-" },
    { id: 4, name: "Ram Sharma", date: "05/15/25", amount: "Rs. 200/-" },
    { id: 5, name: "Ram Sharma", date: "05/15/25", amount: "Rs. 200/-" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied!");
  };

  return (
    <>
      {/* Card Layout */}
      <div className="max-w-4xl h-[800px] mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">Referral</h2>

        {/* Image */}
        <img
          src={Cartoon}
          alt="Referral Illustration"
          className="mx-auto w-48 h-48 object-contain mb-4"
        />

        {/* Referral Code */}
        <div className="bg-[#9DF89D] py-3 px-6 rounded-md font-semibold text-lg">
          Your Code <span className="text-red-600 ml-2">{referralCode}</span>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700"
        >
          Copy Code
        </button>

        {/* Referral List */}
        <div className="mt-6">
          <div className="bg-[#9DF89D] py-2 font-bold rounded-t-md">
            Referral List
          </div>

          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-white">
                <th className="p-2 text-center font-bold">S. No</th>
                <th className="p-2 text-center font-bold">Name</th>
                <th className="p-2 text-center font-bold">Date</th>
                <th className="p-2 text-center font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="border-y-5 border-white">
              {referralList.map((ref) => (
                <tr
                  key={ref.id}
                  className="bg-[#FFF2F2] border-b-5 border-white"
                >
                  <td className="p-2 text-center font-bold">{ref.id}</td>
                  <td className="p-2 text-center font-bold">{ref.name}</td>
                  <td className="p-2 text-center font-bold">{ref.date}</td>
                  <td className="p-2 text-center font-bold">{ref.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Image Section */}
      {/* <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div> */}


      {/* <div className="mt-10">
        <Footer />
      </div> */}
    </>
  );
}
