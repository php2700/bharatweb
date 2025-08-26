export const ContactEmail = () => {
  return (
    <div>
      <div className="text-center mb-12">
        Send us an email for support or inquiries
      </div>
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
            type="email"
            placeholder="Email"
          />
        </div>
        <div>
          <textarea className="w-full py-2 px-4  border rounded-lg" placeholder="Description">
          </textarea>
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
