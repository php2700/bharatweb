import React, { useState } from "react";

export default function LoginPage() {
    const [mobile, setMobile] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`OTP sent to ${mobile}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col md:flex-row w-full max-w-100rem overflow-hidden">

                {/* Left Image */}
                <div >
                    <img
                        src="/src/assets/login/img.png" // apni image ka path
                        alt="Plumber working"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Login Form */}
                <div className="md:w-1/2  flex flex-col justify-center p-8 md:p-16">
                    <div className="flex flex-col items-start space-y-4">
                        {/* Logo */}
                        <img
                            src="/logo.png" // apni logo ka path
                            alt="The Bharat Works"
                            className="w-[286px] h-[90px] object-contain"
                            style={{ marginBottom: '144px', marginLeft: '41px' }} />

                        {/* Heading */}
                        <h2
                            style={{ fontFamily: 'SF Pro Display, sans-serif', fontSize: '18px', marginLeft: '41px', position: 'relative', top: '10px', fontWeight: '800' }}
                            className=" font-bold text-gray-900"
                        >
                            Enter Your Mobile Number
                        </h2>
                        <p className="text-gray-500 text-sm" style={{ fontFamily: 'SF Pro Display, sans-serif', fontSize: '16px', fontWeight: '400', color: '#334247' }}>
                            Just one step to away to start <span style={{ fontFamily: 'SF Pro Display, sans-serif', fontWeight: '600', color: '#334247' }}>The Bharat Works.</span>
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-full mt-4">
                            <div
                                className="flex items-center px-3 w-[300px] sm:w-[330px] md:w-[330px] lg:w-[390px]"
                                style={{
                                    
                                    borderRadius: "12px",
                                    border: "2px solid #C6C6C6",
                                    backgroundColor: "#fff",
                                }}
                            >
                                {/* Flag */}
                                <img
                                    src="/src/assets/login/flag.png" // <-- apna flag ka path de yaha
                                    alt="India Flag"
                                    className="w-6 h-4 mr-2"
                                />

                                {/* Country code + arrow */}
                                <div className="flex items-center text-gray-700 mr-2">
                                    <span style={{ fontFamily: 'SF Pro Display, sans-serif', color: '#000000', fontSize: '14px', fontWeight: '600' }}>+91</span>
                                    <svg
                                        className="w-4 h-4 ml-1 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>

                                {/* Input */}
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-full py-3 px-2 text-gray-700 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="lg:w-[390px] md:w-[330px] w-[330px] mt-6 bg-[#228B22] hover:bg-green-700 text-white font-semibold py-3 rounded-md"
                                style={{ fontSize: "19px", borderRadius: "19px" }}
                            >
                                Send OTP
                            </button>
                        </form>


                    </div>
                </div>

            </div>
        </div>
    );
}
