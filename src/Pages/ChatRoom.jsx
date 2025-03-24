import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import useEnrollment from '../Components/hooks/useEnrollment';
import styles from "../Styles/ChatRoom.module.css";
const socket = io("http://localhost:5000", { autoConnect: false });
// import '../Styles/ChatRoom.css'

const Chatbot = () => {

    // const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const encrolled = useEnrollment();
    const { id: courseId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
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

                if (!response.ok) throw new Error("Failed to fetch messages");

                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit("leaveRoom", courseId);
            socket.disconnect();
        };
    }, [courseId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            sender: { username: "You" }, // Temporary placeholder
            message: newMessage,
            replyTo: replyingTo ? { ...replyingTo } : null,
        };

        // Optimistic UI update
        setMessages((prevMessages) => [...prevMessages, messageData]);

        try {
            const response = await fetch(
                `http://localhost:5000/api/chat/send/${courseId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        message: newMessage,
                        replyTo: replyingTo?._id || null,
                    }),
                }
            );

            if (!response.ok) throw new Error("Failed to send message");

            setNewMessage("");
            setReplyingTo(null);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleReply = (msg) => {
        setReplyingTo(msg);
    };

    // const handleSend = () => {
    //     if (input.trim() === "") return;
    //     setMessages([...messages, { text: input, user: "You" }]);
    //     setInput("");
    //     setTimeout(() => {
    //         setMessages((prev) => [...prev, { text: "I'm a bot! How can I help?", user: "Bot" }]);
    //     }, 1000);
    // };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>Chat Room</div>
            {/* <div className={styles.chatMessages}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.user === "You" ? "user" : "bot"}`}>
                        <strong>{msg.user}: </strong> {msg.text}
                    </div>
                ))}
                {replyingTo && (
                    <div className={styles.replyingTo}>
                        Replying to <strong>{replyingTo.sender.username}</strong>: {replyingTo.message}
                        <button className={styles.cancelReply} onClick={() => setReplyingTo(null)}>Cancel</button>
                    </div>
                )}
            </div> */}
            {
                messages.map((msg, index) => (
                    <div key={index} className={styles.messageWrapper}>
                        {/* {msg.replyTo && (
                            <div className={styles.replyBox}>
                                <strong>Replying to {msg.replyTo.sender.username}:</strong> {msg.replyTo.message}
                            </div>
                        )} */}
                        <div className={styles.messageContent}>
                            <strong>{msg.sender.username}:</strong> {msg.message}
                            {/* <button className={styles.replyButton} onClick={() => handleReply(msg)}>Reply</button> */}
                        </div>
                    </div>
                ))
            }
            <div ref={messagesEndRef}></div>


            <div className={styles.chatInput}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div >
    );
};

export default Chatbot;
