import Header from "../../../component/Header";
import Footer from "../../../component/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Arrow from "../../../assets/profile/arrow_back.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calender from "../../../assets/bidding/calender.png";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

// Define BASE_URL
const BASE_URL = "https://api.thebharatworks.com";

export default function BiddingEditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);

  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategories: [],
    location: "",
    googleAddress: "",
    description: "",
    cost: "",
    deadline: null, // Initialize as null for ReactDatePicker
    images: [],
    existingImages: [],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isAddressConfirmed, setIsAddressConfirmed] = useState({});
  const [errors, setErrors] = useState({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const res = await fetch(`${BASE_URL}/api/work-category`, {
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

  // Fetch task details by ID and autopopulate
  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const res = await fetch(
          `${BASE_URL}/api/bidding-order/getBiddingOrderById/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && data.status) {
          const task = data.data;
          setFormData({
            title: task.title || "",
            category: task.category_id?._id || "",
            subCategories: task.sub_category_ids?.map((s) => s._id) || [],
            googleAddress: task.google_address || "",
            location: `${task.latitude || ""},${task.longitude || ""}`,
            description: task.description || "",
            cost: task.cost || "",
            deadline: task.deadline ? new Date(task.deadline) : null, // Parse deadline as Date
            images: [],
            existingImages: task.image_url || [],
          });
          setSelectedAddress(task.google_address || "");
          if (task.category_id?._id) {
            const resSub = await fetch(
              `${BASE_URL}/api/subcategories/${task.category_id._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const subData = await resSub.json();
            if (resSub.ok) {
              setSubcategories(
                (subData.data || []).map((sub) => ({
                  value: sub._id,
                  label: sub.name,
                }))
              );
            }
          }
        } else {
          toast.error(data.message || "Failed to fetch task details");
        }
      } catch (error) {
        console.error(error);
        toast.error("Server error while fetching task details");
      }
    };
    fetchTaskById();
  }, [id]);

  // Handle category change and fetch subcategories
  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";
    setFormData({ ...formData, category: selectedCatId, subCategories: [] });
    if (!selectedCatId) {
      setSubcategories([]);
      return;
    }
    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(
        `${BASE_URL}/api/subcategories/${selectedCatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  // Handle subcategory change
  const handleSubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subCategories: selectedOptions ? selectedOptions.map((s) => s.value) : [],
    });
  };

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const uniqueFiles = files.filter(
      (file) =>
        !formData.images.some(
          (f) => f.name === file.name && f.size === file.size
        )
    );
    if (formData.images.length + uniqueFiles.length > 5) {
      toast.error("You can upload a maximum of 5 photos");
      e.target.value = "";
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, ...uniqueFiles],
    });
    e.target.value = "";
  };

  // Update location in backend
  const updateLocation = async (addr) => {
    try {
      const token = localStorage.getItem("bharat_token");
      const response = await fetch(`${BASE_URL}/api/user/updatelocation`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: addr.latitude || 28.6139,
          longitude: addr.longitude || 77.209,
          address: addr.address || "New Delhi, India",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Location updated successfully");
        setFormData((prev) => ({
          ...prev,
          googleAddress: addr.address,
          location: `${addr.latitude || ""},${addr.longitude || ""}`,
        }));
      } else {
        toast.error(data.message || "Failed to update location");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while updating location");
    }
  };

  // Handle address selection
  const handleSelectAddress = async (addr, index) => {
    setSelectedAddress(addr.address);
    setFormData({
      ...formData,
      googleAddress: addr.address,
      location: `${addr.latitude || ""},${addr.longitude || ""}`,
    });
    setIsAddressConfirmed((prev) => ({
      ...prev,
      [index]: true,
    }));
    setShowDropdown(false);
    await updateLocation(addr);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate form fields
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategories || formData.subCategories.length === 0)
      newErrors.subCategories = "Please select at least one sub-category";
    if (!formData.googleAddress.trim())
      newErrors.googleAddress = "Address is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.cost || isNaN(formData.cost))
      newErrors.cost = "Valid cost is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    else if (isNaN(new Date(formData.deadline).getTime()))
      newErrors.deadline = "Please provide a valid deadline date";
    else if (new Date(formData.deadline) < new Date())
      newErrors.deadline = "Deadline must be in the future";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((error) => toast.error(error));
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("order_id", id);
      data.append("category_id", formData.category);
      data.append("sub_category_ids", formData.subCategories.join(","));
      data.append("address", formData.googleAddress);
      data.append("google_address", formData.googleAddress);
      data.append("description", formData.description);
      data.append("cost", formData.cost);
      data.append(
        "deadline",
        formData.deadline.toISOString().split("T")[0] // Send only date (YYYY-MM-DD)
      );
      formData.images.forEach((file) => {
        data.append("images", file);
      });
      data.append("existing_images", JSON.stringify(formData.existingImages));

      const res = await fetch(`${BASE_URL}/api/bidding-order/edit`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success("Bidding Task updated successfully");
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
      <div className="container mx-auto px-4 py-4">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="back" />
          Back
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-5xl shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl p-8 space-y-6 mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Edit Task
            </h2>

            {/* Title */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter title of work"
                value={formData.title}
                onChange={handleChange}
                className={`w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Category
              </label>
              <Select
                options={categories}
                value={categories.find((c) => c.value === formData.category)}
                onChange={handleCategoryChange}
                placeholder="Search or select category..."
                isClearable
                className={`border-2 rounded-lg ${
                  errors.category ? "border-red-500" : ""
                }`}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Subcategories */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Subcategories
              </label>
              <Select
                options={subcategories}
                value={subcategories.filter((s) =>
                  formData.subCategories.includes(s.value)
                )}
                onChange={handleSubcategoryChange}
                isMulti
                placeholder="Search or select subcategories..."
                isDisabled={!formData.category}
                className={`border-2 rounded-lg ${
                  errors.subCategories ? "border-red-500" : ""
                }`}
              />
              {errors.subCategories && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subCategories}
                </p>
              )}
            </div>

            {/* Address Selection */}
            <div className="relative">
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Current Address
              </label>
              <input
                type="text"
                placeholder="Click to select address"
                value={selectedAddress}
                readOnly
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-full border-2 border-gray-300 rounded-lg px-4 py-2 cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.googleAddress ? "border-red-500" : ""
                }`}
              />
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
              {showDropdown && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-md w-full mt-1 max-h-48 overflow-y-auto">
                  <li className="px-3 py-2 bg-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
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
                          onChange={() => handleSelectAddress(addr, index)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`address-${index}`}
                          className="flex-1 cursor-pointer"
                          onClick={() => handleSelectAddress(addr, index)}
                        >
                          <p className="font-medium">{addr.title}</p>
                          <p className="text-sm text-gray-600">
                            {addr.landmark}
                          </p>
                          <p className="text-xs text-gray-500">
                            {addr.address}
                          </p>
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
              {errors.googleAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.googleAddress}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your task"
                value={formData.description}
                onChange={handleChange}
                className={`w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Cost */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Cost
              </label>
              <input
                type="number"
                name="cost"
                placeholder="Enter cost in INR"
                value={formData.cost}
                onChange={handleChange}
                className={`w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cost ? "border-red-500" : ""
                }`}
              />
              {errors.cost && (
                <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
              )}
            </div>

            {/* Deadline */}
            <div className="w-full">
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Deadline
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src={Calender}
                    alt="calendar"
                    className="w-5 h-5 text-gray-400"
                  />
                </div>
                <ReactDatePicker
                  selected={formData.deadline}
                  onChange={(date) =>
                    setFormData({ ...formData, deadline: date })
                  }
                  minDate={new Date()}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm"
                  placeholderText="Select deadline"
                  className={`w-full sm:w-[450px] md:w-[550px] lg:w-[830px] border border-gray-300 rounded-md py-2 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.deadline ? "border-red-500" : ""
                  }`}
                  popperClassName="z-50"
                />
              </div>
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="border-2 border-gray-300 rounded-xl p-6 text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-green-600 mb-2"
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
                <span className="text-gray-800 font-medium">
                  Upload Work Photo (Optional)
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button
                  className="px-4 py-1 border border-green-600 rounded-lg mt-3 text-green-600 font-medium hover:bg-green-50"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('input[type="file"]').click();
                  }}
                >
                  Upload
                </button>
              </label>
              {formData.existingImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {formData.existingImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            existingImages: formData.existingImages.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  <span className="text-center w-full text-gray-700 font-medium">
                    New Images
                  </span>
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-green-600 font-medium">
              Upload (.png, .jpg, .jpeg) Files (300px * 300px) - Max 5 photos
              (Optional)
            </span>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-80 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition duration-200 font-semibold"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
