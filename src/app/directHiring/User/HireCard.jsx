import { Phone, MessageSquare } from "lucide-react"; // icons

export default function HireCard  ({ task }) {
  return (
    <div className="flex items-center  bg-white rounded-lg shadow-md p-4">
      <img
        src={task.image}
        alt="Work"
        className="w-32 h-24 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
        <p className="text-xs text-gray-400 mt-1">Posted Date: {task.date}</p>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-md text-xs font-medium ${
            task.status === "Review"
              ? "bg-orange-100 text-orange-600"
              : task.status === "Completed"
              ? "bg-green-100 text-green-600"
              : task.status === "Cancelled"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-end">
        <button className="px-3 py-1 text-sm rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition">
          View Profile
        </button>
        <div className="flex gap-2 text-green-600">
          <Phone className="w-5 h-5 cursor-pointer" />
          <MessageSquare className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};