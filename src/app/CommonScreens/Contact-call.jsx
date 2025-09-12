import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ContactCall = () => {
  const [formData, setFormData] = useState({
    subject: "",
    contactNumber: "",
    description: "",
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10-15 digits";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("bharat_token"); // token from localStorage

      const bodyData = {
        subject: formData.subject,
        mobile_number: formData.contactNumber,
        message: formData.description,
      };

      const response = await fetch(
        `${BASE_URL}/CompanyDetails/contact/mobile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        
        toast.success("Call request submitted successfully!");
        setFormData({ subject: "", contactNumber: "", description: "" });
      } else {
        console.error("API Error ❌", data);
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Network Error ❌", error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
       <ToastContainer position="top-right" autoClose={3000} />
      <div className="text-center">
        Schedule a call, and we'll get back to you
      </div>
      <div className="text-center mb-12">within 15-20 hours.</div>
      <form
        className="grid grid-cols-1 max-w-md mx-auto gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <input
            className={`w-full py-2 px-4 rounded-lg border ${
              errors.subject ? "border-red-500" : "border-[#3342474D]"
            }`}
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <input
            className={`w-full py-2 px-4 rounded-lg border ${
              errors.contactNumber ? "border-red-500" : "border-[#3342474D]"
            }`}
            type="text"
            name="contactNumber"
            placeholder="Contact Number*"
            value={formData.contactNumber}
            onChange={handleChange}
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
          )}
        </div>

        <div>
          <textarea
            className={`w-full h-[127px] py-2 px-4 border rounded-lg ${
              errors.description ? "border-red-500" : "border-[#3342474D]"
            }`}
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <button
          className={`w-full border rounded-lg bg-[#228B22] text-white p-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};
