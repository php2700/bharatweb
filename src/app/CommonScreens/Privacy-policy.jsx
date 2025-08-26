import Footer from "../../component/footer";
import Header from "../../component/Header";
import privacyPolicyImg from "../../assets/privacy-policy/privacy-policy.png";
import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PrivacyPolicy  ()  {
  const [privacyPolicy, setPrivacyPolicyData] = useState();
  const getPrivacyPolicyData = async () => {
    try {
      await axios
        .get(`${BASE_URL}/CompanyDetails/getTermsConditions`)
        .then((res) => {
          setPrivacyPolicyData(res?.data?.content);
          console.log(res?.data);
        });
    } catch (error) {
      console.log(error, "ddd");
    }
  };

  useEffect(() => {
    getPrivacyPolicyData();
  }, []);

  return (
    <>
      <Header />
      <div className="py-10">
        <div className="container py-10">
          <div className="flex justify-center">
            <img src={privacyPolicyImg} className="h-72 w-72 object-cover" />
          </div>
          <div className="text-4xl font-bold text-center my-10">
            PRIVACY POLICY
          </div>
          <div style={{paddingLeft:'10%',paddingRight:'10%'}} dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
        </div>
      </div>
      <Footer />
    </>
  );
};
