import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import banner from "../../../assets/banner.png";
import filterIcon from "../../../assets/directHiring/filter-square.png";
import { SearchIcon } from "lucide-react";
import image from "../../../assets/workcategory/image.png";

export default function RecentPost() {
  const workers = [
    {
      id: 1,
      workName: "Chair work",
      location: "Indore MP",
      status: "#ewe2323",
      image: image,
      amount: "1500",
      date: `21/02/2`,
      completionDate: `21/02/2`,
      skills:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime",
    },
    {
      id: 2,
      workName: "Chair work",
      location: "Indore MP",
      status: "#ewe2323",
      image: image,
      amount: "1500",
      date: `21/02/2`,
      completionDate: `21/02/2`,

      skills:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
    },
    {
      id: 3,
      workName: "Chair work",
      location: "Indore MP",
      status: "#ewe2323",
      image: image,
      amount: "1500",
      date: `21/02/2`,
      completionDate: `21/02/2`,

      skills:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
    },
    {
      id: 4,
      workName: "Chair work",
      location: "Indore MP",
      status: "#ewe2323",
      image: image,
      amount: "1500",
      date: `21/02/2`,
      completionDate: `21/02/2`,

      skills:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
    },
  ];
  return (
    <>
      <Header />
      <div className="min-h-screen py-4 sm:py-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="w-full  mx-auto  overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
        <div className="container max-w-5xl p-10 my-10 mx-auto">
          <div>
            <div className="text-3xl font-bold my-4 text-[#191A1D]">
              Recent Posted Work
            </div>
            <div className="flex gap-4">
              <div className="relative w-full ">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for services"
                  className="w-full pl-9 pr-3 py-2 bg-[#F5F5F5] rounded-lg"
                />
              </div>
              <img src={filterIcon} />
            </div>
            <div className="w-full rounded-xl my-4 space-y-4">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="grid grid-cols-12 items-center bg-white rounded-lg shadow-lg p-4 gap-8"
                >
                  <div className="relative col-span-12  md:col-span-4">
                    <img
                      src={worker.image}
                      alt={worker.work}
                      className="h-full w-full  rounded-lg object-cover"
                    />
                    <span className="absolute bottom-0 rounded-full left-0 w-full bg-black/80 text-white font-medium text-sm px-4 py-2  text-center">
                      {worker?.status}
                    </span>
                  </div>

                  <div className="md:col-span-8 p-4 col-span-12 space-y-2">
                    <div className="flex justify-between ">
                      <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                        {worker.workName}
                      </h2>
                      <div className="flex gap-1  items-center">
                        <div className="font-semibold">
                          {" "}
                          Posted Date:{worker?.date}
                        </div>
                      </div>
                    </div>

                    <div className="leading-tight text-lg">
                      {worker?.skills}
                    </div>
                    <p className="text-sm  font-semibold lg:text-[17px] text-[#008000] my-2">
                      &#8377;{worker.amount}
                    </p>
                    <div className="font-semibold text-lg text-gray-800 ">
                      Completion Date:{worker?.completionDate}
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <div className="text-white bg-red-500 text-sm py-1 px-8 rounded-full">
                        {worker?.location}
                      </div>
                      <div>
                        <button className="text-[#228B22] py-1 px-4 border rounded-lg">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mx-auto my-6 px-4 py-2 bg-[#228B22] text-white font-semibold w-1/4 rounded-full ">
              See All
            </div>
          </div>
        </div>
        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
