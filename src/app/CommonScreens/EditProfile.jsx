import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Arrow from "../../assets/profile/arrow_back.svg";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const location = useLocation();
  const { activeTab } = location.state || { activeTab: "user" };
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: [],
    about: "",
    document: null,
    age: '',
    gender: '',
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  // Fetch profile initially
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Prefill formData and document preview when profile loads
  useEffect(() => {
    if (profile && profile.data) {
      setFormData((prev) => ({
        ...prev,
        name: profile.data.full_name || "",
        about: profile.data.skill || "",
        category: profile.data.category_id || "",
        subcategory: profile.data.subcategory_ids || [],
        age: profile.data.age || '',
        gender: profile.data.gender || '',
      }));

      // Document preview (single document)
      if (profile.data.documents) {
        if (Array.isArray(profile.data.documents)) {
          setDocumentPreview(profile.data.documents[0].url || null);
        } else {
          setDocumentPreview(profile.data.documents);
        }
      }

      // Profile picture
      if (profile.data.profilePic) {
        setProfilePic(profile.data.profilePic);
      }

      // Fetch subcategories for prefill
      if (profile.data.category_id) {
        const fetchSubcategories = async () => {
          try {
            const token = localStorage.getItem("bharat_token");
            const res = await fetch(
              `${BASE_URL}/subcategories/${profile.data.category_id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (res.ok) {
              setSubcategories(
                (data.data || []).map((sub) => ({
                  value: sub._id,
                  label: sub.name,
                }))
              );
            }
          } catch (error) {
            console.error("Error fetching subcategories:", error);
          }
        };
        fetchSubcategories();
      }
    }
  }, [profile]);

  // Fetch categories
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
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";
    setFormData({ ...formData, category: selectedCatId, subcategory: [] });

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
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subcategory: selectedOptions ? selectedOptions.map((s) => s.value) : [],
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "document" && files && files[0]) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/avif",
        "image/gif",
      ];
      if (!allowedTypes.includes(files[0].type)) {
        toast.error("Only PDF or image files are allowed!");
        return;
      }
      setFormData((prev) => ({ ...prev, document: files[0] }));
      setDocumentPreview(URL.createObjectURL(files[0]));
      return;
    }

    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // Trigger hidden file input for profile pic
  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  // Update profile picture
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/PNG images are allowed for profile picture!");
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const fd = new FormData();
      fd.append("profilePic", file);

      const res = await fetch(`${BASE_URL}/user/updateProfilePic`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile pic.");
        return;
      }

      setProfilePic(URL.createObjectURL(file)); // Update preview
      toast.success("Profile picture updated successfully!");
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error("Error updating profile pic:", error);
      toast.error("Something went wrong!");
    }
  };

  // Remove document
  const handleRemoveDocument = async () => {
    // If document is a new upload (not yet saved to server), clear locally
    if (formData.document && documentPreview?.startsWith('blob:')) {
      setFormData((prev) => ({ ...prev, document: null }));
      setDocumentPreview(null);
      toast.success("Document removed successfully!");
      return;
    }

    // If document is from server, call API to remove
    try {
      const token = localStorage.getItem("bharat_token");
      const imagePath = profile?.data?.documents?.[0]?.url || profile?.data?.documents;
      if (!imagePath) {
        toast.error("No document found to remove.");
        return;
      }

      const res = await fetch(`${BASE_URL}/user/deleteHisworkImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagePath }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to remove document.");
        return;
      }

      setFormData((prev) => ({ ...prev, document: null })); // Clear document
      setDocumentPreview(null); // Clear document preview
      toast.success("Document removed successfully!");
      dispatch(fetchUserProfile()); // Refresh profile data
    } catch (error) {
      console.error("Error removing document:", error);
      toast.error("Something went wrong while removing the document!");
    }
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Name is required!");
    if (!formData.about.trim() && activeTab !== "user")
      return toast.error("Skill is required!");

    try {
      const token = localStorage.getItem("bharat_token");

      if (activeTab === "worker") {
        if (!formData.category) return toast.error("Category is required!");
        if (!formData.subcategory.length)
          return toast.error("Select at least one subcategory!");
        if (!formData.age) return toast.error("Age is required!");
        const fd = new FormData();
        if (formData.document) {
          fd.append("document", formData.document);
        }
        fd.append("category_id", formData.category);
        formData.subcategory.forEach((sub) =>
          fd.append("subcategory_ids[]", sub)
        );
        fd.append("skill", formData.about);
        fd.append("age", formData.age);
        fd.append("gender", formData.gender);

        const res = await fetch(`${BASE_URL}/user/updateUserDetails`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok)
          return toast.error(data.message || "Failed to update worker profile.");

        // Update name
        const payload = { full_name: formData.name };
        const resName = await fetch(`${BASE_URL}/user/updateUserProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const dataName = await resName.json();
        if (!resName.ok)
          return toast.error(dataName.message || "Failed to update name.");

        toast.success("Worker profile updated successfully!");
        setTimeout(() => {
          navigate("/details");
        }, 2000);
      }

      if (activeTab === "user") {
        const namePayload = { full_name: formData.name };
        const resName = await fetch(`${BASE_URL}/user/updateUserProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(namePayload),
        });
        const dataName = await resName.json();
        if (!resName.ok)
          return toast.error(dataName.message || "Failed to update name.");

        const skillPayload = { skill: formData.about };
        const resSkill = await fetch(`${BASE_URL}/user/updateUserDetails`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(skillPayload),
        });
        const dataSkill = await resSkill.json();
        if (!resSkill.ok)
          return toast.error(dataSkill.message || "Failed to update skill.");

        toast.success("User profile updated successfully!");
        setTimeout(() => {
          navigate("/details");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Header />
      <div className="mt-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-700 mb-4 hover:underline"
        >
          <img src={Arrow} className="w-6 h-6 ml-10" alt="Back arrow" />
          Back
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-[50rem] mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {activeTab === "worker" ? "Get your profile verified" : "Update User Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              onInput={(e) => {
                if (e.target.value.length > 2) {
                  e.target.value = e.target.value.slice(0, 2); // max 2 digits
                }
              }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Worker Fields */}
          {activeTab === "worker" && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Category
                </label>
                <Select
                  options={categories}
                  value={categories.find((c) => c.value === formData.category)}
                  onChange={handleCategoryChange}
                  placeholder="Search or select category..."
                  isClearable
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Subcategory
                </label>
                <Select
                  options={subcategories}
                  value={subcategories.filter((s) =>
                    formData.subcategory.includes(s.value)
                  )}
                  onChange={handleSubcategoryChange}
                  isMulti
                  placeholder="Search or select subcategories..."
                  isDisabled={!formData.category}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Upload Document
                </label>
                <label className="w-full flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                  <span className="text-gray-700">
                    {formData.document ? formData.document.name : "Choose a file"}
                  </span>
                  <input
                    type="file"
                    name="document"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                <p className="text-base font-medium text-gray-700 mt-1">
                  (Allowed Documents: Driving License, PAN Card, Aadhaar, Passport, or
                  any Govt. ID (PDF / Image))
                </p>

                {/* Document preview */}
                {documentPreview && (
                  <div className="mt-4 relative">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Document Preview
                    </h3>
                    <div className="relative w-32 h-32">
                      <img
                        src={documentPreview}
                        alt="Document Preview"
                        className="w-full h-full object-cover mt-2 rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveDocument}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                        aria-label="Remove document"
                      >
                        X
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* About Skill */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              About My Skill
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Describe your skill..."
              maxLength={500}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              rows="4"
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              {formData.about.length}/500 characters
            </p>
          </div>

          <button
            type="submit"
            className="w-64 lg:w-72 mx-auto bg-[#228b22] text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-lg block"
          >
            Submit
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}