// src/components/EditProfile.jsx
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userSlice";
import { Pencil } from "lucide-react";

export default function EditProfile() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  const location = useLocation();
  const { activeTab } = location.state || { activeTab: "user" };

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: [],
    about: "",
    document: null,
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch profile initially
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
 console.log(profile);
  // Prefill formData when profile loads
  useEffect(() => {
    if (profile && profile.data) {
      setFormData((prev) => ({
        ...prev,
        name: profile.data.full_name || "",
        about: profile.data.skill || "",
        category: profile.data.category_id || "",
        subcategory: profile.data.subcategory_ids || [],
       
        
      }));
      
       
   
      
      
      
     

      // If category exists, fetch subcategories for prefill
      if (profile.data.category_id) {
        const fetchSubcategories = async () => {
          try {
            const token = localStorage.getItem("bharat_token");
            const res = await fetch(
              `https://api.thebharatworks.com/api/subcategories/${profile.data.category_id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (res.ok) {
              setSubcategories(
                (data.data || []).map((sub) => ({ value: sub._id, label: sub.name }))
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
        const res = await fetch("https://api.thebharatworks.com/api/work-category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCategories(
            (data.data || []).map((cat) => ({ value: cat._id, label: cat.name }))
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
      const res = await fetch(
        `https://api.thebharatworks.com/api/subcategories/${selectedCatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  // Handle subcategory select
  const handleSubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subcategory: selectedOptions ? selectedOptions.map((s) => s.value) : [],
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "document" && files[0]) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(files[0].type)) {
        alert("Only PDF or image files are allowed!");
        return;
      }
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
      alert("Only JPG/PNG images are allowed for profile picture!");
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const fd = new FormData();
      fd.append("profilePic", file);

      const res = await fetch(
        "https://api.thebharatworks.com/api/user/updateProfilePic",
        { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: fd }
      );
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to update profile pic.");

      alert("Profile picture updated successfully!");
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error("Error updating profile pic:", error);
      alert("Something went wrong!");
    }
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert("Name is required!");
    if (!formData.about.trim() && activeTab !== "user")
      return alert("Skill is required!");

    try {
      const token = localStorage.getItem("bharat_token");

      if (activeTab === "vendor") {
        if (!formData.category) return alert("Category is required!");
        if (!formData.subcategory.length)
          return alert("Select at least one subcategory!");
        if (!formData.document) return alert("Document required!");

        // 1️⃣ updateUserDetails
        const fd = new FormData();
        fd.append("document", formData.document);
        fd.append("category_id", formData.category);
        formData.subcategory.forEach((sub) => fd.append("subcategory_ids[]", sub));
        fd.append("skill", formData.about);

        const res = await fetch(
          "https://api.thebharatworks.com/api/user/updateUserDetails",
          { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: fd }
        );
        const data = await res.json();
        if (!res.ok) return alert(data.message || "Failed to update vendor profile.");

        // 2️⃣ update name
        const payload = { full_name: formData.name };
        const resName = await fetch(
          "https://api.thebharatworks.com/api/user/updateUserProfile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const dataName = await resName.json();
        if (!resName.ok)
          return alert(dataName.message || "Failed to update name.");

        alert("Vendor profile updated successfully!");
      }

      if (activeTab === "user") {
        // Name update
        const namePayload = { full_name: formData.name };
        const resName = await fetch(
          "https://api.thebharatworks.com/api/user/updateUserProfile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(namePayload),
          }
        );
        const dataName = await resName.json();
        if (!resName.ok) return alert(dataName.message || "Failed to update name.");

        // Skill update
        const skillPayload = { skill: formData.about };
        const resSkill = await fetch(
          "https://api.thebharatworks.com/api/user/updateUserDetails",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(skillPayload),
          }
        );
        const dataSkill = await resSkill.json();
        if (!resSkill.ok) return alert(dataSkill.message || "Failed to update skill.");

        alert("User profile updated successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-[50rem] mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Update Your Profile
        </h2>

        {/* Profile Image with Pencil */}
        

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

          {/* Vendor Fields */}
          {activeTab === "vendor" && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Category</label>
                <Select
                  options={categories}
                  value={categories.find((c) => c.value === formData.category)}
                  onChange={handleCategoryChange}
                  placeholder="Search or select category..."
                  isClearable
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Subcategory</label>
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
                <label className="block mb-2 font-semibold text-gray-700">Upload Document</label>
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
                <p className="text-sm text-gray-500 mt-1">Only PDF or image files allowed</p>
         
              </div>
              <img src={Pencil} alt="" />
            </>
          )}

          {/* About Skill */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">About My Skill</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Describe your skill..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              rows="4"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-64 lg:w-72 mx-auto bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-lg block"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
