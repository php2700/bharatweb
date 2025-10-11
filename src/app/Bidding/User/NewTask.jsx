import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Arrow from "../../../assets/profile/arrow_back.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calender from "../../../assets/bidding/calender.png";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function BiddingNewTask() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    profile?.location?.address || ""
  );
  const [selectedAddressObj, setSelectedAddressObj] = useState(null);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategories: [],
    googleAddress: "",
    description: "",
    cost: "",
    deadline: "",
    images: [],
  });

  let location = "";
  if (profile && profile.data) {
    location = profile.data.full_address || "";
  }

  const [errors, setErrors] = useState({});

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const res = await fetch(`${BASE_URL}/work-category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCategories(
            (data.data || []).map((cat) => ({
              value: cat._id,
              label: cat.name,
            }))
          );
        } else {
          toast.error(data.message || "Failed to fetch categories");
        }
      } catch (error) {
        console.error(error);
        toast.error("Server error while fetching categories");
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";
    setFormData({ ...formData, category: selectedCatId, subCategories: [] });

    if (!selectedCatId) return setSubcategories([]);

    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/subcategories/${selectedCatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSubcategories(
          (data.data || []).map((sub) => ({ value: sub._id, label: sub.name }))
        );
      } else {
        toast.error(data.message || "Failed to fetch subcategories");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while fetching subcategories");
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subCategories: selectedOptions ? selectedOptions.map((s) => s.value) : [],
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  // 🔹 Handle address selection
  const handleSelect = (addr, index) => {
    setSelectedAddress(addr.address);
    setSelectedAddressObj(addr);
    setIsAddressConfirmed((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // 🔹 API call to update location
  const updateLocation = async (addr) => {
    try {
      const token = localStorage.getItem("bharat_token");
      const response = await fetch(`${BASE_URL}/user/updatelocation`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: addr.latitude || 28.6139,
          longitude: addr.longitude || 77.2090,
          address: addr.address || "New Delhi, India",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          googleAddress: addr.address,
        }));
      } else {
        toast.error(data.message || "Failed to update location");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while updating location");
    }
  };

  useEffect(() => {
    if (selectedAddressObj && isAddressConfirmed[profile?.full_address?.indexOf(selectedAddressObj)]) {
      updateLocation(selectedAddressObj);
      setShowDropdown(false); // Close dropdown after confirmation
    }
  }, [isAddressConfirmed, selectedAddressObj]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("bharat_token");
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "You need to login first to post a task!",
        icon: "warning",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#228B22",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (!formData.title.trim()) {
      return toast.error("Title is required");
    }

    if (!formData.category) {
      return toast.error("Category is required");
    }

    if (!formData.subCategories || formData.subCategories.length === 0) {
      return toast.error("Please select at least one sub-category");
    }

    if (!formData.googleAddress.trim()) {
      return toast.error("Address is required");
    }

    if (!formData.description.trim()) {
      return toast.error("Description is required");
    }

    if (!formData.cost || isNaN(formData.cost)) {
      return toast.error("Valid cost is required");
    }

    if (!formData.deadline) {
      return toast.error("Deadline is required");
    } else if (isNaN(new Date(formData.deadline).getTime())) {
      return toast.error("Please provide a valid deadline date");
    }

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("category_id", formData.category);
      data.append("sub_category_ids", formData.subCategories.join(","));
      data.append("address", formData.googleAddress);
      data.append("google_address", formData.googleAddress);
      data.append("description", formData.description);
      data.append("cost", formData.cost);
      data.append("deadline", formData.deadline);

      formData.images.forEach((file) => {
        data.append("images", file);
      });

      const res = await fetch(
        "https://api.thebharatworks.com/api/bidding-order/create",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      const resData = await res.json();
      if (res.ok) {
        toast.success("Bidding Task posted successfully");
        setTimeout(() => {
          navigate("/bidding/order-detail/" + resData.order._id);
        }, 2000);
      } else {
        toast.error(resData.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again later");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-4 mt-20">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="back" />
          Back
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-[72rem] shadow">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[51rem] p-8 space-y-6 ml-[155px]"
          >
            <h2 className="text-[30px] font-[700] text-center mb-6 text-[#191A1D]">
              Post New Task
            </h2>

            {/* Title */}
            <div>
              <label className="block text-[17px] font-[500] mb-1">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title of work"
                value={formData.title}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-3 py-2"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Category
              </label>
              <Select
                options={categories}
                value={categories.find((c) => c.value === formData.category)}
                onChange={handleCategoryChange}
                placeholder="Select category"
                isClearable
                className="border-2 rounded-lg"
              />
            </div>

            {/* Subcategories */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Subcategories
              </label>
              <Select
                options={subcategories}
                value={subcategories.filter((s) =>
                  formData.subCategories.includes(s.value)
                )}
                onChange={handleSubcategoryChange}
                isMulti
                placeholder="Select subcategory"
                isDisabled={!formData.category}
                className="border-2 rounded-lg"
              />
            </div>

            {/* Address Selection */}
            <div className="relative">
              <label className="block text-[17px] font-[500] mb-1">
                Current Address
              </label>
              <input
                type="text"
                placeholder="Click to select location"
                value={selectedAddress}
                readOnly
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full border-2 rounded-lg px-3 py-2 cursor-pointer pr-10"
              />

              {/* Dropdown Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute right-3 top-10 text-gray-500 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>

              {/* Dropdown List with Heading and Radio Buttons */}
              {showDropdown && (
                <ul className="absolute z-10 bg-white border rounded-lg shadow-md w-full mt-1 max-h-48 overflow-y-auto">
                  <li className="px-3 py-2 bg-gray-100">
                    <h3 className="text-lg font-semibold text-[#191A1D]">
                      Select an Address
                    </h3>
                  </li>
                  {profile?.full_address?.length > 0 ? (
                    profile.full_address.map((addr, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      >
                        <input
                          type="radio"
                          id={`address-${index}`}
                          checked={isAddressConfirmed[index] || false}
                          onChange={() => handleSelect(addr, index)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`address-${index}`}
                          className="flex-1 cursor-pointer"
                          onClick={() => handleSelect(addr, index)}
                        >
                          <p className="font-medium">{addr.title}</p>
                          <p className="text-sm text-gray-600">{addr.landmark}</p>
                          <p className="text-xs text-gray-500">{addr.address}</p>
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 text-sm">
                      No saved addresses
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Other Fields */}
            <div>
              <label className="block text-[17px] font-[500] mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your task"
                value={formData.description}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-[17px] font-[500] mb-1">Cost</label>
              <input
                type="number"
                name="cost"
                placeholder="Enter cost in INR"
                value={formData.cost}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
                Add Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={Calender} alt="" className="w-5 h-5" />
                </div>
                <ReactDatePicker
                  selected={
                    formData.deadline ? new Date(formData.deadline) : null
                  }
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      deadline: date.toISOString(),
                    })
                  }
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm"
                  placeholderText="Select deadline"
                  className="w-[754px] border-2 border-[#777777] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="border-2 border-[#777777] rounded-xl p-6 text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-[#228B22] mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3"
                  />
                </svg>
                <span className="text-[#000000] font-medium">
                  Upload Work Photo (Optional)
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const uniqueFiles = files.filter(
                      (file) =>
                        !formData.images.some(
                          (f) => f.name === file.name && f.size === file.size
                        )
                    );

                    if (formData.images.length + uniqueFiles.length > 5) {
                      toast.error("You can upload max 5 photos");
                      e.target.value = "";
                      return;
                    }

                    setFormData({
                      ...formData,
                      images: [...formData.images, ...uniqueFiles],
                    });

                    e.target.value = "";
                  }}
                />
                <button
                  className="p-[2px] border border-[#228B22] rounded-[10px] w-[93px] mt-[13px] text-[#228B22] font-[500]"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('input[type="file"]').click();
                  }}
                >
                  Upload
                </button>
              </label>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index),
                          });
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-[#008000] font-[500]">
              Upload (.png, .jpg, .jpeg) Files (300px * 300px) - Max 5 photos (Optional)
            </span>

            <br />
            <button
              type="submit"
              className="w-80 bg-[#228B22] hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md mt-[20px]"
            >
              Post Task
            </button>
          </form>
        </div>
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
