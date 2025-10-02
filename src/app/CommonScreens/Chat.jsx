import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import defaultPic from "../../assets/default-image.jpg";
import Header from "../../component/Header";
import Footer from "../../component/footer";
const Base_url = import.meta.env.VITE_SOCKET_URL;
const socket = io("https://api.thebharatworks.com/");

const Chat = () => {
  const senderId = localStorage.getItem("senderId");
  const receiverId = localStorage.getItem("receiverId"); // Assuming standard spelling; adjust if key is different
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]); // Renamed from images to files for generality
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]); // For image previews only
  const [isLoading, setIsLoading] = useState(true);
  const [isChatInitialized, setIsChatInitialized] = useState(false); // Tracks full initialization
  const scrollRef = useRef();
  const fileInputRef = useRef(null);

  const fetchUserDetails = async (memberId) => {
    try {
      const res = await axios.get(`${Base_url}api/users/${memberId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data.user;
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      return { _id: memberId, full_name: "Unknown User" }; // Fallback
    }
  };

  // Enrich conversations with user details
  const enrichConversations = async (convs) => {
    const enriched = await Promise.all(
      convs.map(async (conv) => {
        const enrichedMembers = await Promise.all(
          conv.members.map(async (member) => {
            if (typeof member === "string") {
              return await fetchUserDetails(member);
            }
            return member; // Already an object, use as is
          })
        );
        return { ...conv, members: enrichedMembers };
      })
    );
    return enriched;
  };

useEffect(() => {
  const fetchConversations = async () => {
    setIsLoading(true);
    setIsChatInitialized(false); // Reset initialization state
    try {
      const res = await axios.get(
        `${Base_url}api/chat/conversations/${senderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let conversationsWithUnread = res.data.conversations.map((conv) => ({
        ...conv,
        unreadCount: 0,
      }));

      // Enrich conversations with user details
      conversationsWithUnread = await enrichConversations(conversationsWithUnread);
      setConversations(conversationsWithUnread || []);

      let selectedChat = null;

      // ✅ If receiverId is present in localStorage, start or continue that chat
      if (receiverId) {
        const existingConv = conversationsWithUnread.find((conv) =>
          conv.members.some((m) => m._id === receiverId)
        );

        if (existingConv) {
          // If conversation already exists, use it (don’t add duplicate)
          selectedChat = existingConv;
        } else {
          // Otherwise, create a new conversation
          const createRes = await axios.post(
            `${Base_url}api/chat/conversations`,
            { senderId, receiverId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const newConv = {
            ...createRes.data.conversation,
            unreadCount: 0,
          };

          // Enrich members
          const enrichedMembers = await Promise.all(
            newConv.members.map(async (member) => {
              if (typeof member === "string") {
                return await fetchUserDetails(member);
              }
              return member;
            })
          );

          const enrichedNewConv = { ...newConv, members: enrichedMembers };

          // Only add if it doesn’t already exist
          setConversations((prev) => {
            if (prev.some((c) => c._id === enrichedNewConv._id)) {
              return prev;
            }
            return [...prev, enrichedNewConv];
          });

          selectedChat = enrichedNewConv;
        }

        // ✅ clear receiverId only after using it
        localStorage.removeItem("receiverId");
      } else {
        // If no receiver, load last selected or first conversation
        const lastSelectedConvId = localStorage.getItem("lastSelectedConvId");
        if (lastSelectedConvId) {
          selectedChat = conversationsWithUnread.find(
            (conv) => conv._id === lastSelectedConvId
          );
        }
        if (!selectedChat && conversationsWithUnread.length > 0) {
          selectedChat = conversationsWithUnread[0];
        }
      }

      setCurrentChat(selectedChat);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      alert("Failed to load conversations. Please try again.");
    } finally {
      setIsLoading(false);
      setIsChatInitialized(true);
    }
  };

  if (senderId) {
    fetchConversations();
  }
}, [senderId, receiverId]); // ✅ depend on receiverId too


  useEffect(() => {
    socket.emit("addUser", senderId);
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => socket.off("getUsers");
  }, [senderId]);

  useEffect(() => {
    if (currentChat) {
      socket.emit("joinRoom", currentChat._id);
    }
  }, [currentChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const res = await axios.get(
            `${Base_url}api/chat/messages/${currentChat._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setMessages(res.data.messages || []);
          setConversations((prev) =>
            prev.map((conv) =>
              conv._id === currentChat._id ? { ...conv, unreadCount: 0 } : conv
            )
          );
          setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (currentChat && data.conversationId === currentChat._id) {
        setMessages((prev) => [...prev, data]);
      } else if (conversations.some((conv) => conv._id === data.conversationId)) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === data.conversationId
              ? {
                  ...conv,
                  lastMessage: data.message,
                  unreadCount: conv.unreadCount + 1,
                }
              : conv
          )
        );
      }
    });
    return () => socket.off("getMessage");
  }, [currentChat, conversations]);

  useEffect(() => {
    if (currentChat) {
      localStorage.setItem("lastSelectedConvId", currentChat._id);
    }
  }, [currentChat]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      alert("Maximum 5 files allowed");
      return;
    }

    const uniqueFiles = [];
    const seen = new Set();
    selectedFiles.forEach((file) => {
      const fileKey = `${file.name}-${file.size}`;
      if (!seen.has(fileKey)) {
        seen.add(fileKey);
        uniqueFiles.push(file);
      }
    });

    setFiles(uniqueFiles);

    const previews = uniqueFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && files.length === 0) return;

    if (!currentChat || !isChatInitialized) {
      alert("Please wait for the chat to fully load before sending a message.");
      return;
    }

    const chatReceiverId = currentChat.members.find((m) => m._id !== senderId)?._id;
    if (!chatReceiverId) {
      alert("Receiver ID not found in conversation");
      return;
    }

    try {
      let newMsg;
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        formData.append("senderId", senderId);
        formData.append("receiverId", chatReceiverId);
        formData.append("conversationId", currentChat._id);
        formData.append("messageType", "image");
        if (message.trim()) formData.append("message", message);

        const res = await axios.post(`${Base_url}api/chat/messages`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        newMsg = res.data.newMessage;
      } else {
        newMsg = {
          senderId,
          receiverId: chatReceiverId,
          conversationId: currentChat._id,
          message,
          messageType: "text",
        };
        const res = await axios.post(`${Base_url}api/chat/messages`, newMsg, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        newMsg = res.data.newMessage;
      }

      socket.emit("sendMessage", newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
      setFiles([]);
      setFilePreviews([]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

  return (
		<>
		<Header />
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white mt-20">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 shadow-md">
        <h3 className="p-4 text-lg font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-white">
          Chats
        </h3>
        <div className="p-2">
          {Array.isArray(conversations) &&
            conversations.map((conv) => {
              const otherUser = conv.members.find((m) => m._id !== senderId);
              return (
                <div
                  key={conv._id}
                  onClick={() => setCurrentChat(conv)}
                  className={`p-3 flex items-center cursor-pointer hover:bg-gray-100 transition duration-200 ${
                    conv._id === currentChat?._id ? "bg-gray-200" : ""
                  }`}
                >
                  <img
                    src={otherUser?.profile_pic || defaultPic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <strong className="text-sm font-medium text-gray-900">
                      {otherUser?.full_name || "User"}
                    </strong>
                    <p className="text-xs text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto bg-white shadow-inner">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              Loading chat...
            </div>
          ) : messages.map((msg, index) => (
            <div
              key={msg._id}
              ref={index === messages.length - 1 ? scrollRef : null}
              className={`mb-3 ${
                msg.senderId === senderId ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg max-w-[70%] ${
                  msg.senderId === senderId
                    ? "bg-gradient-to-br from-green-500 to-green-400 text-white"
                    : "bg-gray-100 text-gray-800"
                } shadow-sm`}
              >
                {msg.messageType === "image" && msg.image?.length > 0 ? (
                  <div className="space-y-2">
                    {msg.image.map((fileUrl, idx) => {
                      const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
                      return isPdf ? (
                        <div
                          key={idx}
                          className="flex flex-col items-start space-y-1 p-2 border rounded-lg bg-gray-50"
                        >
                          <embed
                            src={`${Base_url}/${fileUrl}`}
                            type="application/pdf"
                            className="w-40 h-40 rounded-lg border border-gray-200"
                          />
                          <a
                            href={`${Base_url}/${fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            View PDF
                          </a>
                        </div>
                      ) : (
                        <img
                          key={idx}
                          src={`${Base_url}/${fileUrl}`}
                          alt="Sent image"
                          className="w-40 h-40 object-cover rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                        />
                      );
                    })}
                    {msg.message && <div className="mt-2 text-sm">{msg.message}</div>}
                  </div>
                ) : (
                  <p className="text-sm">{msg.message}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* Input */}
        {currentChat && (
          <div className="p-3 bg-white border-t border-gray-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                onKeyPress={(e) => !isLoading && isChatInitialized && e.key === "Enter" && sendMessage()}
                disabled={isLoading || !isChatInitialized}
              />
              <label className="flex items-center p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  disabled={isLoading || !isChatInitialized}
                />
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </label>
              <button
                onClick={sendMessage}
                className="p-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition duration-200"
                disabled={isLoading || !isChatInitialized}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
            {filePreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto p-2 bg-gray-50 rounded-lg">
                {filePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-md border border-gray-200 hover:shadow-md transition duration-200"
                  />
                ))}
              </div>
            )}
            {files.filter((file) => !file.type.startsWith("image/")).length > 0 && (
              <div className="flex gap-2 overflow-x-auto p-2 bg-gray-50 rounded-lg">
                {files
                  .filter((file) => !file.type.startsWith("image/"))
                  .map((file, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-xs">
                      📎 {file.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
		<Footer />
		</>
  );
};

export default Chat;
