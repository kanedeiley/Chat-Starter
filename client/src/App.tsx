import { useState, useRef, useEffect } from 'react'

interface Message {
  role: "system" | "assistant" | "user"
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I assist you today?" }
  ])
  const [userInput, setUserInput] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("General")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetcher = async (newMessages: Message[]): Promise<{ reply: string }> => {
    try {
      // Send the entire messages array to the API
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      return { reply: data.reply };
    } catch (error) {
      console.error("Error fetching from API:", error);
      return { reply: "Sorry, there was an error communicating with the server." };
    }
  };
  
  const sendMessage = async (): Promise<void> => {
    if (!userInput.trim()) return
  
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userInput }
    ]
  
    setMessages(newMessages)
    setUserInput("")
    setIsLoading(true)
  
    try {
      const data = await fetcher(newMessages)
      if (data && data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }])
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="text-slate-700 border-b border-slate-300 py-3 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">VESTA</h1>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-full border rounded-lg py-2 px-4 border-slate-300 focus:outline-none"
        >
          <option value="General">General</option>
          <option value="Tech Support">Tech Support</option>
          <option value="Sales">Sales</option>
        </select>
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`px-5 py-2.5 rounded-lg  ${
              msg.role === "user" ? "bg-slate-100 ml-auto w-fit max-w-[70%]" : ""
            }`}
          >
            <span>{msg.content}</span>  
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

     {/* Input Section */}
<div className="bg-white border-t border-gray-300 p-4 flex items-center space-x-3">
  <textarea
    maxLength={400}
    disabled={isLoading}
    value={userInput}
    onChange={(e) => {
      setUserInput(e.target.value)
      const target = e.target as HTMLTextAreaElement
      target.style.height = "auto" // Reset height to calculate the new height
      target.style.height = `${Math.min(target.scrollHeight, 250)}px` // Dynamically adjust height, max 250px
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault() // Prevent adding a new line
        sendMessage() // Call the sendMessage function
        const target = e.target as HTMLTextAreaElement
        target.style.height = "auto" // Reset height after submission
      }
    }}
    placeholder={isLoading ? "Loading..." : "Type your message..."}
    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
    style={{ maxHeight: "250px", overflowY: "auto" }} // Prevent resizing beyond 250px
  />

  <button
    onClick={() => {
      sendMessage()
      const textarea = document.querySelector("textarea") as HTMLTextAreaElement
      if (textarea) textarea.style.height = "auto" // Reset height after submission
    }}
    disabled={isLoading}
    className={`bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition duration-200 flex items-center justify-center ${
      isLoading ? "cursor-not-allowed" : ""
    }`}
  >
    {isLoading ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5 animate-spin"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    )}
  </button>
</div>
    </div>
  )
}

export default App
