import callIcon from "../../../assets/directHiring/call.png";
import messageIcon from "../../../assets/directHiring/message.png";
import {useEffect} from "react";

export default function HireCard({ task }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex  my-4  bg-white rounded-lg shadow-2xl p-4">
      <img
        src={task.image}
        alt="Work"
        className="w-32 h-24 object-cover rounded-lg"
      />

      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
        <p className="text-xs font-semibold text-gray-600 mt-1">
          Posted Date: {task.date}
        </p>

        <span
          className={`inline-block mt-2 px-3 py-1 bg-red-400 text-white rounded-md text-xs font-medium 
          `}
        >
          {task.address}
        </span>
      </div>

      {task?.status == "Pending" ? (
        <div className="flex items-end gap-2 text-[#228B22]">
          <img className="w-5 h-5 cursor-pointer" src={callIcon} />
          <img className="w-5 h-5 cursor-pointer" src={messageIcon} />
          <button className="px-3 py-1 text-sm rounded-lg border border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-white transition">
            View Profile
          </button>
        </div>
      ) : task.status == "Completed" ? (
        <>
          <div className="flex flex-col justify-end  gap-2 text-[#228B22]">
            <div className="px-3 py-1  text-sm rounded-lg border border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-white transition text-end">
              View Profile
            </div>
            <div className="flex items-center gap-2">
              <img className="w-5 h-5 cursor-pointer " src={callIcon} />
              <img className="w-5 h-5 cursor-pointer" src={messageIcon} />
              <button className="px-3 py-1 text-sm rounded-lg border border-[#228B22] text-white hover:bg-[#228B22] bg-[#228B22] hover:text-white transition">
                {task?.status}
              </button>
            </div>
          </div>
        </>
      ) : task.status == "Cancelled" ? (
        <>
          <div className="flex flex-col justify-end  gap-2 text-[#228B22]">
            <div className="text-right px-3 py-1 text-sm rounded-lg border border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-white transition">
              View Profile
            </div>
            <div className="flex items-end gap-2">
              <button className="px-3 py-1 text-sm rounded-lg  text-white  bg-red-600  transition">
                {task?.status}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-end  gap-2 text-[#228B22]">
            <div className="text-right px-3 py-1 text-sm rounded-lg border border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-white transition">
              {task?.status}
            </div>
            <div className="text-right px-3 py-1 text-sm rounded-lg border border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-white transition">
              View Profile
            </div>
            <div className="flex items-center gap-2">
              <img className="w-5 h-5 cursor-pointer" src={callIcon} />
              <img className="w-5 h-5 cursor-pointer" src={messageIcon} />
              <button className="px-3 py-1 text-sm rounded-lg border border-[#228B22] text-white hover:bg-[#228B22] bg-[#228B22] hover:text-white transition ">
                Completed
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}




{ /*<label className="block">
            <span className="text-sm font-medium text-gray-600 flex items-center justify-between">
              Address
            </span>
            <div className="relative">
              <input
                id="address-input"
                type="text"
                readOnly
                value={address || profile?.location?.address}
                placeholder="Enter or select address"
                className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
                aria-invalid={errors.address ? "true" : "false"}
                onClick={() => setShowOptions(!showOptions)}
              />
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="absolute right-3 top-2 px-2 py-1 text-sm rounded-lg border bg-gray-100 hover:bg-gray-200"
              >
                {showOptions ? "▲" : "▼"}
              </button>
              {showOptions && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg p-3 z-50">
                  {profile?.full_address?.map((loc) => (
                    <label
                      key={loc.address}
                      className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                    >
                      <input
                        type="radio"
                        name="address"
                        value={loc.address}
                        checked={address === loc.address}
                        onClick={() => {
                          setAddress(loc.address);
                          setShowOptions(false);
                          updateAddress(loc);
                        }}
                      />
                      <div className="flex flex-col bg-gray-50 rounded-lg p-2 w-full">
                        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                          <div>
                            <span className="block font-semibold text-xs">
                              Title
                            </span>
                            <span className="text-[12px] text-gray-800">
                              {loc.title}
                            </span>
                          </div>
                          <div>
                            <span className="block font-semibold text-xs">
                              House No
                            </span>
                            <span className="text-gray-700 text-[12px]">
                              {loc.houseno ? loc?.houseno : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="block font-semibold text-xs">
                              Area
                            </span>
                            <span className="text-gray-700 text-[12px]">
                              {loc.area ? loc.area : "N/A"}
                            </span>
                          </div>
													 <div>
                            <span className="block font-semibold text-xs">
                              Pincode
                            </span>
                            <span className="text-gray-700 text-[12px]">
                              {loc.pincode ? loc.pincode : "N/A"}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="block font-semibold text-xs">
                              Full Address
                            </span>
                            <span className="text-gray-600 text-[12px]">
                              {loc.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </label>*/}
