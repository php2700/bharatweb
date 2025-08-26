import BankImg from "../assets/bank/bank-account.png";
import Footer from "../component/footer";
import Header from "../component/Header";

export const BankDetails = () => {
  return (
    <>
      <Header />
      <div className="p-10">
        <div className="p-10 container max-w-5xl mx-auto">
          <div className="flex justify-center">
            <img src={BankImg} className="h-72 w-72 object-contain" />
          </div>
          <div className="shadow-2xl my-4  rounded-lg px-10 py-10 min-h-[100vh]">
            <div className="text-3xl font-bold">Bank Details</div>
            <div className="mb-8">Add your bank details</div>
            <form className="grid grid-cols-1 gap-4">
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  placeholder="Bank Name"
                />
              </div>
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  placeholder="Account Number"
                />
              </div>
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  placeholder="Account Holder Name"
                />
              </div>
              <div>
                <input
                  className="py-2 px-4 w-full rounded-xl border"
                  type="text"
                  placeholder="IFSC Code"
                />
              </div>
              <div className="flex justify-center w-full">
                <button className="py-2 px-2 bg-[#228B22]  w-1/2 text-white rounded-xl">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
