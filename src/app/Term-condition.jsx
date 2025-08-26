import Footer from "../component/footer";
import Header from "../component/Header";
import TermCondition from "../assets/term-condition/term-condition.png";
import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TermCondtion = () => {
  const [termConditionData, setTermConditionData] = useState();
  const getTermAndConditionData = async () => {
    try {
      await axios
        .get(`${BASE_URL}/CompanyDetails/getTermsConditions`)
        .then((res) => {
          setTermConditionData(res?.data?.content);
          console.log(res?.data);
        });
    } catch (error) {
      console.log(error, "ddd");
    }
  };

  useEffect(() => {
    getTermAndConditionData();
  }, []);

  return (
    <>
      <Header />
      <div className="py-10">
        <div className="container py-10">
          <div className="flex justify-center">
            <img src={TermCondition} className="h-72 w-72 object-cover" />
          </div>
          <div className="text-4xl font-bold text-center my-10">
            TERMS AND CONDITIONS
          </div>
          <div style={{paddingLeft:'10%',paddingRight:'10%'}} dangerouslySetInnerHTML={{ __html: termConditionData }} />
        </div>
      </div>
      <Footer />
    </>
  );
};
