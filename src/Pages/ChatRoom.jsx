import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import styles from "../styles/ChatRoom.module.css";
import useEnrollment from "../Components/hooks/useEnrollment";

const ChatRoom = () => {
    const navigate = useNavigate();
    const enrolled = useEnrollment();
    const { id: courseId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Check Authorization
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/courses/confirminstructor/${courseId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                const result = await response.json();
                if (result.success || enrolled) {
                    setIsAuthorized(true);
                } else {
                    navigate("/unauthorized");
                }
            } catch (error) {
                console.error("Authorization error:", error);
                navigate("/unauthorized");
            }
        };

        if (courseId) {
            checkAuthorization();
        }
    }, [courseId, enrolled, navigate]);

    // Initialize socket and fetch messages
    useEffect(() => {
        if (!isAuthorized || !courseId) return;

        socketRef.current = io("http://localhost:5000", {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        const socket = socketRef.current;
        socket.connect();
        socket.emit("joinRoom", courseId);

        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/chat/${courseId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Setup listener for incoming messages
        const handleReceiveMessage = (message) => {
            setMessages((prevMessages) => {
                // Prevent duplicate messages
                if (!prevMessages.some((msg) => msg._id === message._id)) {
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.emit("leaveRoom", courseId);
            socket.off("receiveMessage", handleReceiveMessage); // Clean up listener
            socket.disconnect();
        };
    }, [isAuthorized, courseId]);

    // Auto-scroll effect
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Send message handler
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/chat/send/${courseId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ message: newMessage }),
                }
            );

            if (!res.ok) throw new Error("Failed to send message");

            const savedMessage = await res.json();

            if (!savedMessage || !savedMessage._id) {
                throw new Error("Invalid message data received from the server");
            }

            // Emit message only once to the server
            socketRef.current.emit("sendMessage", {
                courseId,
                message: savedMessage.message,
                user: {
                    _id: savedMessage.sender._id,
                    username: savedMessage.sender.username,
                },
            });

            // Clear input after sending
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    if (!isAuthorized) return <div>Unauthorized access. Redirecting...</div>;

    return (
        <div className={styles.chatContainer}>
            <h2 className={styles.chatHeader}>Course Chat Room</h2>

            <div className={styles.chatBox}>
                {messages.map((msg) => (
                    <div key={msg._id} className={styles.messageWrapper}>
                        <div className={styles.messageContent}>
                            <strong>{msg.sender?.username || "Unknown"}:</strong>{" "}
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatInput}>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className={styles.sendButton} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
