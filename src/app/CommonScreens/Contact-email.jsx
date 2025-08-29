import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const ContactEmail = () => {
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    description: "",
  });

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
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
        email: formData.email,
        message: formData.description,
      };

      const response = await fetch(
        "https://api.thebharatworks.com/api/CompanyDetails/contact/email",
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
        toast.success(data.message);
        setFormData({ subject: "", email: "", description: "" });
      } else {
        console.error("API Error ❌", data);
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Network Error ❌", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="text-center mb-12">
        Send us an email for support or inquiries
      </div>
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
              errors.email ? "border-red-500" : "border-[#3342474D]"
            }`}
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
          className={`w-full rounded-lg bg-[#228B22] text-white p-2 ${
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
