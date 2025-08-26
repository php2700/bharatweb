export const ContactCall = () => {
  return (
    <div>
      <div className="text-center">
        Schedule a call, and we'll get back to you
      </div>
      <div className="text-center mb-12">within 15-20 hours.</div>
      <form className="grid grid-cols-1 max-w-md mx-auto gap-4">
        <div>
          <input
            className="w-full py-2 px-4  rounded-lg border"
            type="text"
            placeholder="Subject"
          />
        </div>
        <div>
          <input
            className="w-full py-2 px-4 rounded-lg border"
            type="text"
            placeholder="Contact Number*"
          />
        </div>
        <div>
          <textarea
            className="w-full py-2 px-4  border rounded-lg"
            placeholder="Description"
          ></textarea>
        </div>
        <button
          className="w-full border rounded-lg bg-[#228B22] text-white p-2"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
