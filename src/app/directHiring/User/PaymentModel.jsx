import paymentProcess from "../../../assets/directHiring/paymentprocess.png";

export default function PaymentModel({ open, close }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray/10 backdrop-blur-[1px] z-50">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md px-8 py-10 text-center">
        <div></div>
        <img
          src={paymentProcess}
          alt="Access Restriction"
          className="mx-auto mt-6 mb-6 h-32"
        />

        <p className="text-gray-700 font-medium mb-8">
          We are on the way for Payment
        </p>
        <p className="text-left leading-tight text-[10px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
          asperiores tenetur sapiente qui totam doloribus veritatis ipsum, est
          consequatur saepe temporibus ipsa adipisci iusto mollitia itaque optio
          ratione ad! Atque.
        </p>

        <div className="flex gap-2 justify-center w-full my-8">
          <button className="bg-[#228B22] text-white px-2 py-2 w-full rounded-lg hover:bg-green-700 transition">
            Okay
          </button>
          <button
            onClick={close}
            className="text-[#228B22] border border-[#228B22] px-2 py-2 w-full rounded-lg   "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
