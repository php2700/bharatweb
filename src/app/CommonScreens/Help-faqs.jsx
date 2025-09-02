import Footer from "../../component/footer";
import Header from "../../component/Header";
import HelpFaq from "../../assets/help-faqs/help-faqs.png";
import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HelpFaqs ()  {
  const [helpFaqsData, setHelpFaqsData] = useState();
  const getHelpFaqsData = async () => {
    try {
      await axios
        .get(`${BASE_URL}/CompanyDetails/getTermsConditions`)
        .then((res) => {
          setHelpFaqsData(res?.data?.content);
          console.log(res?.data);
        });
    } catch (error) {
      console.log(error, "ddd");
    }
  };
  useEffect(() => {
    getHelpFaqsData();
    window.scrollTo(0, 0); // 👈 Scroll to top when component mounts
  }, []);

  useEffect(() => {
    getHelpFaqsData();
  }, []);

  return (
    <>
      <Header />
      <div className="py-10">
        <div className="container py-10">
          <div className="flex justify-center">
            <img src={HelpFaq} className="h-72 w-72 object-cover" />
          </div>
          <div className="text-4xl font-bold text-center my-10">HELP & FAQ</div>
          <div style={{paddingLeft:'10%',paddingRight:'10%'}} dangerouslySetInnerHTML={{ __html: helpFaqsData }} />
        </div>
      </div>
      <Footer />
    </>
  );
};
