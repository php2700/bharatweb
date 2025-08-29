import { Phone, MessageSquare } from "lucide-react";
import callIcon from "../../../assets/directHiring/call.png";
import messageIcon from "../../../assets/directHiring/message.png";

export default function HireCard({ task }) {
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
