// RoleSelection.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "../../redux/roleSlice";
import { CheckCircle } from "lucide-react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { fetchUserProfile } from "../../redux/userSlice"; 
import business from "../../assets/selection/business.png";
import customer from "../../assets/selection/customer.png";
import banner from "../../assets/profile/banner.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Arrow from "../../assets/profile/arrow_back.svg";

export default function RoleSelection() {
  const dispatch = useDispatch();
  const selectedRole = useSelector((state) => state.role.selectedRole);
      const { profile, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch])
  
  

    const navigate = useNavigate();
 
  const roleMap = {
  service_provider: "Business",
  user: "Customer",
};
 const handleContinue = () => {
    if (selectedRole) {
      localStorage.setItem("role", selectedRole); // save in localStorage
      navigate("/profile"); // ✅ redirect to profile page
    }
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" />
          Back
        </Link>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-white px-4">
       
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] xl:pb-[147px] lg:pb-[147px]">
          {/* Title */}
          <h2 className="text-[22px] font-bold text-gray-800">
            Select Your Role
          </h2>
          <p className="text-[16px] text-gray-500 font-medium mt-1">
            Please choose whether you are a Worker or a <br /> Customer to
            proceed
          </p>

          {/* Role Options */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 mt-6">
            {/* Customer */}
            <div
              onClick={() => dispatch(selectRole("user"))}
              className={`flex flex-col items-center cursor-pointer transition-transform ${
                selectedRole === "customer" ? "scale-105" : ""
              }`}
            >
              <div className="relative">
                <div
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-4 bg-white shadow-[0px_2px_1px_1px_#bab1b1] ${
                    selectedRole === "user"
                      ? "border-green-600"
                      : "border-transparent"
                  }`}
                >
                   <img
                    src={business}
                    alt="Business"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-[82px]"
                  />
                </div>

                {selectedRole === "user" && (
                  <CheckCircle
                    size={20}
                    className="absolute bottom-1 right-7 rounded-full p-[3px] bg-[#228B22] stroke-white"
                  />
                )}
              </div>
              <p className="mt-2 font-medium text-lg sm:text-xl drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]">
                Customer
              </p>
            </div>
            {/* Business */}
            <div
              onClick={() => dispatch(selectRole("service_provider"))}
              className={`flex flex-col items-center cursor-pointer transition-transform ${
                selectedRole === "business" ? "scale-105" : ""
              }`}
            >
              <div className="relative">
                <div
                  className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-4 bg-white shadow-[0px_2px_1px_1px_#bab1b1] ${
                    selectedRole === "service_provider"
                      ? "border-green-600"
                      : "border-transparent"
                  }`}
                >
                   <img
                    src={customer}
                    alt="Customer"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-[82px]"
                  />
                 
                </div>

                {selectedRole === "service_provider" && (
                  <CheckCircle
                    size={20}
                    className="absolute bottom-1 right-7 rounded-full p-[3px] bg-[#228B22] stroke-white"
                  />
                )}
              </div>
              <p className="mt-2 font-medium text-lg sm:text-xl text-black drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]">
                Business
              </p>
            </div>

            
          </div>

          {/* Sub Text */}
          <p className="mt-6 text-[17px] text-gray-500 font-medium">
            Looking For Hiring
          </p>

          {/* Button */}
          {/* Button */}
<button
onClick={handleContinue}
  className={`mt-[67px] w-full sm:w-80 py-3 rounded-[15px] font-semibold transition 
    bg-[#228B22] text-white ${
      !selectedRole ? " cursor-not-allowed" : "hover:bg-green-700"
    }`}
  disabled={!selectedRole}
>
  {selectedRole ? `Continue as ${roleMap[selectedRole]}` : "Select Any One"}
</button>
        </div>
      </div>

      {/* Banner */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>


      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
