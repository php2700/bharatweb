import { useState } from "react";
import BankImg from "../../assets/bank/bank-account.png";
import Footer from "../../component/footer";
import Header from "../../component/Header";

export default function BankDetails() {
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    holderName: "",
    ifsc: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 9-18 digits";
    }

    if (!formData.holderName.trim()) {
      newErrors.holderName = "Account holder name is required";
    }

    if (!formData.ifsc.trim()) {
      newErrors.ifsc = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
      newErrors.ifsc = "Invalid IFSC code format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const token = localStorage.getItem("bharat_token"); // token yaha se milega

        const response = await fetch(
          "https://api.thebharatworks.com/api/user/updateBankDetails",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // Bearer token
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("API Response ✅", data);
          alert("Bank details added successfully!");
          // yahan redirect ya state update kar sakte ho
        } else {
          console.error("API Error ❌", data);
          alert(data.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Network Error ❌", error);
        alert("Network error. Please try again.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="p-10">
        <div className="p-10 container max-w-5xl mx-auto">
          <div className="flex justify-center">
            <img src={BankImg} className="h-72 w-72 object-contain" alt="Bank" />
          </div>
          <div className="shadow-2xl my-4 rounded-lg px-10 py-10 min-h-[100vh]">
            <div className="text-3xl font-bold">Bank Details</div>
            <div className="mb-8">Add your bank details</div>

            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              {/* Bank Name */}
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  name="bankName"
                  placeholder="Bank Name"
                  value={formData.bankName}
                  onChange={handleChange}
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm">{errors.bankName}</p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  name="accountNumber"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm">{errors.accountNumber}</p>
                )}
              </div>

              {/* Holder Name */}
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  name="holderName"
                  placeholder="Account Holder Name"
                  value={formData.holderName}
                  onChange={handleChange}
                />
                {errors.holderName && (
                  <p className="text-red-500 text-sm">{errors.holderName}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  name="ifsc"
                  placeholder="IFSC Code"
                  value={formData.ifsc}
                  onChange={handleChange}
                />
                {errors.ifsc && (
                  <p className="text-red-500 text-sm">{errors.ifsc}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-center w-full">
                <button
                  type="submit"
                  className="py-2 px-2 bg-[#228B22] w-1/2 text-white rounded-xl"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
