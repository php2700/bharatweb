import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const Base_url = import.meta.env.VITE_SOCKET_URL;
const socket = io("https://api.thebharatworks.com/");

const Chat = () => {
  const senderId = localStorage.getItem("senderId");
  console.log("User ID from Redux:", senderId);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef();

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${Base_url}api/chat/conversations/${senderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setConversations(res.data.conversations || []);
        if (res.data.conversations.length > 0) setCurrentChat(res.data.conversations[0]); // Auto-select first chat
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, [senderId]);

  // Join Socket
  useEffect(() => {
    socket.emit("addUser", senderId);
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => socket.off("getUsers");
  }, [senderId]);

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
      } else if (conversations.some((conv) => conv._id === data.conversationId)) {
        // Update the conversation list if it's a new message in an existing conversation
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === data.conversationId ? { ...conv, lastMessage: data.message } : conv
          )
        );
      }
    });
    return () => socket.off("getMessage");
  }, [currentChat, conversations]);

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
    const receiverId = currentChat.members.find((m) => m._id !== senderId)?._id;
    if (!receiverId) {
      alert("Receiver ID not found in conversation");
      return;
    }

    try {
      let newMsg;
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));
        formData.append("senderId", senderId);
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
        newMsg = {
          senderId,
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
      setImages([]);
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
        {Array.isArray(conversations) &&
          conversations.map((conv) => {
            const otherUser = conv.members.find((m) => m._id !== senderId);
            return (
              <div
                key={conv._id}
                onClick={() => setCurrentChat(conv)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  background: conv._id === currentChat?._id ? "#f0f0f0" : "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={otherUser?.profilePic || "default-profile-pic-url"}
                  alt="Profile"
                  style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
                />
                <div>
                  <strong>{otherUser?.name || "User"}</strong>
                  <br />
                  <small>{conv.lastMessage}</small>
                </div>
              </div>
            );
          })}
      </div>

      {/* Chat Box */}
      <div style={{ width: "70%", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "1", padding: "10px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div
              key={msg._id}
              ref={index === messages.length - 1 ? scrollRef : null}
              style={{
                textAlign: msg.senderId === senderId ? "right" : "left",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: msg.senderId === senderId ? "#dcf8c6" : "#fff",
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
                        src={`${Base_url}/${imgUrl}`}
                        alt="Sent image"
                        style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", marginBottom: "5px" }}
                      />
                    ))}
                    {msg.message && <div>{msg.message}</div>}
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
              multiple
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
