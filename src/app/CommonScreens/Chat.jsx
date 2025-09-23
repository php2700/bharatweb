import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Base_url = import.meta.env.VITE_SOCKET_URL;

const socket = io("https://api.thebharatworks.com/");

const Chat = () => {
	const { receiverId } = useParams();
	 const user = useSelector((state) => state.user.profile);
	 const userId = user?._id;
	 console.log("User ID from Redux:", userId);
	console.log("Receiver ID from URL:", receiverId);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]); // State for multiple images
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef();
  

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${Base_url}api/chat/conversations/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, [userId]);

  // Join Socket
  useEffect(() => {
    socket.emit("addUser", userId);
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => socket.off("getUsers");
  }, [userId]);

  // Fetch messages when chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const res = await axios.get(`${Base_url}api/chat/messages/${currentChat._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setMessages(res.data.messages || []);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      }
    };
    fetchMessages();
  }, [currentChat]);

  // Receive message from socket
  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (currentChat && data.conversationId === currentChat._id) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.off("getMessage");
  }, [currentChat]);

  // Start a new conversation
  const startConversation = async () => {
    if (!receiverId) {
      alert("Please enter a receiver ID");
      return;
    }
    try {
      const res = await axios.post(
        `${Base_url}api/chat/conversations`,
        { senderId: userId, receiverId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const newConversation = res.data.conversation;
      setConversations((prev) => [...prev, newConversation]);
      setCurrentChat(newConversation);
    } catch (err) {
      console.error("Failed to start conversation:", err);
      alert("Failed to start conversation");
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages(files);
  };

  // Send message (text or images)
  const sendMessage = async () => {
    if (!message.trim() && images.length === 0) return;
    const receiverId = "68abec670fa4a01b9b742ddf";
    if (!receiverId) {
      alert("Receiver ID not found in conversation");
      return;
    }

    try {
      let newMsg;
      if (images.length > 0) {
        // Upload images
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image)); // Match backend field name
        formData.append("senderId", userId);
        formData.append("receiverId", receiverId);
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
        // Send text message
        newMsg = {
          senderId: userId,
          receiverId,
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
      setImages([]); // Clear images after sending
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message");
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <h3 style={{ padding: "10px" }}>Chats</h3>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            placeholder="Enter receiver ID"
            value={receiverId}
            style={{ width: "70%", padding: "5px" }}
          />
          <button onClick={startConversation} style={{ padding: "5px" }}>
            Start Chat
          </button>
        </div>
        {Array.isArray(conversations) &&
          conversations.map((conv) => {
            const otherUser = conv.members.find((m) => m._id !== userId);
            return (
              <div
                key={conv._id}
                onClick={() => setCurrentChat(conv)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  background: conv._id === currentChat?._id ? "#f0f0f0" : "white",
                }}
              >
                <strong>{otherUser?.name || "User"}</strong>
                <br />
                <small>{conv.lastMessage}</small>
              </div>
            );
          })}
      </div>

      {/* Chat Box */}
      <div style={{ width: "70%", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div
              key={msg._id}
              ref={index === messages.length - 1 ? scrollRef : null}
              style={{
                textAlign: msg.senderId === userId ? "right" : "left",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: msg.senderId === userId ? "#dcf8c6" : "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                }}
              >
                {msg.messageType === "image" && msg.image?.length > 0 ? (
                  <div>
                    {msg.image.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={`${Base_url}/${imgUrl}`} // Prepend server URL
                        alt="Sent image"
                        style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", marginBottom: "5px" }}
                      />
                    ))}
                    {msg.message && <div>{msg.message}</div>} {/* Display text if included */}
                  </div>
                ) : (
                  msg.message
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {currentChat && (
          <div style={{ padding: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ flex: 1, padding: "10px" }}
            />
            <input
              type="file"
              accept="image/*"
              multiple // Allow multiple file selection
              onChange={handleImageChange}
              style={{ padding: "5px" }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
