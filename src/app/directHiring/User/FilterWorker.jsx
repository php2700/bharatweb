export default function FilterWorker(){
    return (
        <>
          <div className="max-w-4xl  container mx-auto p-10">
          <div className="text-center font-semibold text-2xl  ">
            {" "}
            Search other worker with same categories
          </div>
          <div className="text-center text-red-500 font-semibold text-lg">
            (Note :You can hire only one worker on this task)
          </div>
          <div className="flex justify-end">
            <img src={filterIcon} />
          </div>
          <div className="relative w-full ">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search for services"
              className="w-full pl-9 pr-3 py-2 bg-[#F5F5F5] rounded-lg"
            />
          </div>
          <div className="my-10">
            {workers.map((worker) => (
              <div
                key={worker._id}
                className="flex flex-col sm:flex-row items-center shadow-2xl justify-between p-4 gap-4"
              >
                <div className="flex items-center space-x-6 w-full sm:w-auto ">
                  <div className="relative">
                    <img
                      src={worker.image || image}
                      alt={worker.name}
                      className="w-36 h-36 sm:w-60 sm:h-45 rounded-lg object-cover"
                    />
                    <span className="absolute bottom-9 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#6DEA6D] text-[#FFFFFF] font-[500] text-xs px-3 py-1 rounded-full shadow w-[125px] sm:w-[131px] sm:h-[25px] lg:w-[184px] lg:p-[0px] lg:text-center lg:text-[15px]">
                      {worker.status || "Pending"}
                    </span>
                  </div>
                  <div className="lg:mb-[123px] relative h-full">
                    <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                      {worker.name}
                    </h2>
                    <p className="text-sm lg:text-[17px] text-gray-500">
                      &#8377;{worker.amount}
                    </p>
                    <div className="absolute ">{worker?.location}</div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col md:flex-col lg:flex-col xl:flex-col gap-4">
                  <div className="text-semibold flex items-center gap-1">
                    <div>4.5</div>
                    <img className="h-6 w-6" src={ratingImg} />
                  </div>
                  <button
                    type="button"
                    className=" text-[#228B22] bg-green-200 border px-5 py-1 rounded shadow"
                  >
                    Offer Sent
                  </button>
                  <button className="bg-red-500 text-white px-5 py-1 rounded shadow hover:bg-[#121212]">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>{" "}
        </div>
        </>
    )
}