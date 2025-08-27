import hireaccess from "../../../assets/directHiring/hireaccess.png";

export default function HireModel({ open, close }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray/10 backdrop-blur-[1px] z-50">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md px-8 py-10 text-center">
        <img
          src={hireaccess}
          alt="Access Restriction"
          className="mx-auto mt-6 mb-6 h-32"
        />

        <p className="text-gray-700 font-medium mb-8">
          You need to hire first then you can access call and message
        </p>

        <button
          onClick={close}
          className="bg-[#228B22] text-white px-10 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
