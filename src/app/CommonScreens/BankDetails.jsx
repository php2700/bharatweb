import React, { useState, useEffect } from "react";
import BankImg from "../../assets/bank/bank-account.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function BankDetails() {
  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bankdetail = profile ? profile.bankdetail : null;
  const [isSaved, setIsSaved] = useState(false); // Add vs Update mode
  const [loading, setLoading] = useState(false); // Loader
   const [isEdit, setIsEdit] = useState(false); // ⬅ form editable or not

  const [formData, setFormData] = useState({
    bankName: bankdetail ? bankdetail.bankName : "",
    accountNumber: bankdetail ? bankdetail.accountNumber : "",
    accountHolderName: bankdetail ? bankdetail.accountHolderName : "",
    ifscCode: bankdetail ? bankdetail.ifscCode : "",
    upiId: bankdetail ? bankdetail.upiId : "", // Added upiId to initial state for completeness
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // detect backend data
useEffect(() => {
  if (bankdetail && bankdetail.bankName) {
    setIsSaved(true);     // bank details present
    setIsEdit(false);     // keep disabled
  } else {
    setIsSaved(false);    // bank details empty
    setIsEdit(true);      // keep editable until user submits
  }
}, [bankdetail]);




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

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = "Account holder name is required";
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) { // Fixed typo: formData.ifsc -> formData.ifscCode
      newErrors.ifscCode = "Invalid IFSC code format";
    }

    // Inside validation function
    if (formData.upiId) {   // ✅ only validate if UPI ID is entered
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(formData.upiId)) {
        newErrors.upiId = "Enter a valid UPI ID";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit) return;
    if (validate()) {
      setLoading(true); // Loader Start
      try {

        const token = localStorage.getItem("bharat_token"); // token yaha se milega

        const response = await fetch(
          `${BASE_URL}/user/updateBankDetails`,
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
          dispatch(fetchUserProfile());
          setIsEdit(false); 
          if (isSaved) {
            toast.success("Bank details updated successfully!");
          } else {
            toast.success("Bank details added successfully!");
          }

          setIsSaved(true); // now button switches to UPDATE
          setTimeout(() => {
            setLoading(false);
          }, 3000);

        } else {
          toast.error("API Error ❌", data);
          setLoading(false); // Stop loader
        }
      } catch (error) {
        toast.error("Network Error ❌", error);
        setLoading(false); // Stop loader
      }
    }
  };

  return (
    <>
      {/* <Header /> */}
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
       <div className="px-4 sm:px-6 md:px-10 py-8 w-full">
  <div className="container max-w-3xl mx-auto">

    {/* Image */}
    <div className="flex justify-center mb-6">
      <img 
        src={BankImg} 
        className="h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 object-contain" 
        alt="Bank" 
      />
    </div>

    <div className="shadow-2xl rounded-lg px-4 sm:px-8 md:px-10 py-8 bg-white">

      {/* Title and Edit Button */}
      {/* Title and Edit Button */}
<div className="flex justify-between items-center mb-6">
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
    Bank Details
  </h1>

  {/* SHOW EDIT BUTTON ONLY WHEN: bank saved & not editing */}
  {isSaved && !isEdit && (
    <button
      onClick={() => setIsEdit(true)}
      className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
    >
      Edit
    </button>
  )}
</div>


      {/* Form */}
      <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
        
        {/* Bank Name */}
        <input
          disabled={!isEdit}
          className={`py-2 px-4 w-full rounded-xl border ${!isEdit ? "bg-gray-100" : ""}`}
          type="text"
          name="bankName"
          placeholder="Bank Name"
          value={formData.bankName}
          onChange={handleChange}
        />
        {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}

        {/* Account Number */}
        <input
          disabled={!isEdit}
          className={`py-2 px-4 w-full rounded-xl border ${!isEdit ? "bg-gray-100" : ""}`}
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={handleChange}
        />
        {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}

        {/* Account Holder */}
        <input
          disabled={!isEdit}
          className={`py-2 px-4 w-full rounded-xl border ${!isEdit ? "bg-gray-100" : ""}`}
          type="text"
          name="accountHolderName"
          placeholder="Account Holder Name"
          value={formData.accountHolderName}
          onChange={handleChange}
        />
        {errors.accountHolderName && <p className="text-red-500 text-sm">{errors.accountHolderName}</p>}

        {/* IFSC */}
        <input
          disabled={!isEdit}
          className={`py-2 px-4 w-full rounded-xl border ${!isEdit ? "bg-gray-100" : ""}`}
          type="text"
          name="ifscCode"
          placeholder="IFSC Code"
          value={formData.ifscCode}
          onChange={handleChange}
        />
        {errors.ifscCode && <p className="text-red-500 text-sm">{errors.ifscCode}</p>}

        {/* UPI */}
        <input
          disabled={!isEdit}
          className={`py-2 px-4 w-full rounded-xl border ${!isEdit ? "bg-gray-100" : ""}`}
          type="text"
          name="upiId"
          placeholder="UPI ID (optional)"
          value={formData.upiId}
          onChange={handleChange}
        />
        {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId}</p>}

        {/* Submit Button */}
        <div className="flex justify-center w-full mt-4">
          {/* Submit Button - ONLY SHOW WHEN isEdit === true */}
{isEdit && (
  <div className="flex justify-center w-full mt-4">
    <button
      type="submit"
      disabled={loading}
      className={`py-2 px-2 w-full sm:w-1/2 rounded-xl text-white flex justify-center items-center gap-2
        ${loading ? "bg-[#228B22]/60 cursor-not-allowed" : "bg-[#228B22] cursor-pointer"}
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        "Submit"
      )}
    </button>
  </div>
)}

        </div>

      </form>
    </div>
  </div>
</div>

      {/* <Footer /> */}
    </>
  );
}
