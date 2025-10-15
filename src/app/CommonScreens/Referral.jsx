import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cartoon from "../../assets/Referral/cartoon.svg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Referral() {
  const [referralData, setReferralData] = useState({
    code: "",
    totalReferred: 0,
    remainingReferrals: 0,
    maxReferrals: 0,
    wallet_balance: 0,
    referredUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchReferralData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/referral/summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
          },
        });

        if (response.data.success) {
          setReferralData(response.data.data);
        } else {
          if (
            response.data.message ===
            "You have not generated any referral code yet."
          ) {
            setReferralData(response.data.data);
            setError(response.data.message);
          } else {
            setError("Failed to fetch referral data: " + response.data.message);
          }
        }
      } catch (err) {
        setError("Error fetching referral data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const createReferralCode = async (e) => {
    e?.preventDefault(); // ✅ prevent page refresh or navigation

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/referral/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
          },
        }
      );

      console.log("Create Referral Response:", response.data);

      if (response.data.success) {
        // ✅ Update only code and maxReferrals
        setReferralData((prev) => ({
          ...prev,
          code: response.data.code,
          maxReferrals: response.data.maxUsage || prev.maxReferrals,
        }));

        setError(null);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Referral code created successfully!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        setError("Failed to create referral code: " + response.data.message);
      }
    } catch (err) {
      setError("Error creating referral code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralData.code);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Referral code copied to clipboard!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Referral</h2>

      {/* Image */}
      <img
        src={Cartoon}
        alt="Referral Illustration"
        className="mx-auto w-48 h-48 object-contain mb-4"
      />

      {/* Referral Stats */}
      <div className="mb-4 text-lg">
        <p>
          Total Referred:{" "}
          <span className="font-semibold">{referralData.totalReferred}</span>
        </p>
        <p>
          Remaining Referrals:{" "}
          <span className="font-semibold">
            {referralData.remainingReferrals}
          </span>
        </p>
				<p>
          Max Referrals:{" "}
          <span className="font-semibold">
            {referralData.maxReferrals}
          </span>
        </p>
        <p>
          Wallet Balance:{" "}
          <span className="font-semibold">
            Rs. {referralData.wallet_balance}/-
          </span>
        </p>
      </div>

      {/* Referral Code or Create Button */}
      {referralData.code ? (
        <>
          <div className="bg-[#9DF89D] py-3 px-6 rounded-md font-semibold text-lg">
            Your Code{" "}
            <span className="text-red-600 ml-2">{referralData.code}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700"
          >
            Copy Code
          </button>
        </>
      ) : (
        <button
          onClick={createReferralCode}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
        >
          Create Referral Code
        </button>
      )}

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
            {referralData.referredUsers?.length > 0 ? (
              referralData.referredUsers.map((user, index) => (
                <tr
                  key={user.id || index}
                  className="bg-[#FFF2F2] border-b-5 border-white"
                >
                  <td className="p-2 text-center font-bold">{index + 1}</td>
                  <td className="p-2 text-center font-bold">
                    {user.full_name}
                  </td>
                  <td className="p-2 text-center font-bold">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-2 text-center font-bold">
                    Rs. {user.wallet_balance}/-
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No referrals yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
