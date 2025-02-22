"use client";


import { useState } from "react";
import ReactMarkdown from "react-markdown";


export default function Home() {
 const [input, setInput] = useState("");
 const [response, setResponse] = useState(null);
 const [loading, setLoading] = useState(false);
 const [history, setHistory] = useState([]);
 const [selectedChat, setSelectedChat] = useState(null);


 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!input.trim()) return;


   setLoading(true);


   try {
     const res = await fetch("/api/chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ messages: [{ role: "user", content: input }] }),
     });


     if (!res.ok) {
       throw new Error("Failed to fetch response");
     }


     const data = await res.json();
     setResponse({ role: "assistant", content: data.answer });


     setHistory([...history, { id: history.length, title: input, response: data.answer }]);
   } catch (error) {
     console.error("Error fetching response:", error);
   }


   setInput("");
   setLoading(false);
 };


 const handleSelectChat = (id) => {
   const chat = history.find((chat) => chat.id === id);
   if (chat) {
     setResponse({ role: "assistant", content: chat.response });
     setSelectedChat(id);
   }
 };


 return (
   <div className="flex h-screen">
     {/* Sidebar */}
     <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
       <h2 className="text-xl font-bold mb-4">Chat History</h2>
       <ul>
         {history.map((chat) => (
           <li
             key={chat.id}
             className={`p-2 cursor-pointer ${selectedChat === chat.id ? "bg-gray-700" : "hover:bg-gray-700"}`}
             onClick={() => handleSelectChat(chat.id)}
           >
             {chat.title}
           </li>
         ))}
       </ul>
     </div>


     {/* Chat Area */}
     <div className="flex flex-col items-center justify-center w-3/4 bg-gray-100 p-6">
       <h1 className="text-3xl font-bold mb-6 text-black">Chatbot</h1>
       <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
         <input
           type="text"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           placeholder="Type your message..."
           className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
         />
         <button
           type="submit"
           className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
           disabled={loading}
         >
           {loading ? "Generating response..." : "Send"}
         </button>
       </form>


       {/* Display only latest response */}
       <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-full max-w-md h-96 overflow-y-auto">
         <h2 className="text-lg font-semibold text-black">Response:</h2>
         <div className="mt-2">
           {response && (
             <div className="p-3 rounded-md bg-gray-900 text-white">
               <strong>Bot:</strong>
               <div className="mt-2">
                 <ReactMarkdown>{response.content}</ReactMarkdown>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   </div>
 );
}



