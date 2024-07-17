'use client';

import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';
import { FiSend, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';




  

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 1);

      return () => clearTimeout(timer);
    }
  }, [text, currentIndex]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading,setIsLoading] =useState(false)
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newUserMessage = { role: "user", parts: [inputMessage] };
      setMessages(prev => [...prev, newUserMessage]);
      setInputMessage('');
      setIsTyping(true);
  
      const token = localStorage.getItem('token');
      const sessionId = Cookies.get('sessionid'); // Get the session ID from cookies
  
      try {
        const host_name = process.env.NEXT_PUBLIC_HOST_NAME;
        const response = await fetch(`${host_name}/api-auth/chatstream/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cookie': `sessionid=${sessionId}` // Include the session ID in the Cookie header
          },
          body: JSON.stringify({ message: inputMessage }),
          credentials: 'include', // This is important for including cookies in the request
          redirect: "follow"
        });
  
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
  
        const data = await response.json();
        console.log(data)
        const aiResponse = data.Response[data.Response.length - 1];
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { role: "model", parts: ["Sorry, I encountered an error. Please try again."] }]);
      } finally {
        setIsTyping(false);
      }
    }
  };


  const handleLogout = async () => {
    // Remove the token from localStorage
    
    const token = localStorage.getItem('token');
    // Redirect to login page or another appropriate page
    setIsLoading(true)
    try {
      const host_name = process.env.NEXT_PUBLIC_HOST_NAME;
        const response = await fetch(`${host_name}/api-auth/logout/`, {
          method: 'POST',
  
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
          
          },
          body: JSON.stringify({  })
        });

        if (!response.ok) {
          setIsLoading(false)
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data)
        
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false)
      }

      localStorage.removeItem('token');
    router.push('/login');
};

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="docuchat-logo-2.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold text-gray-800">DocuChat</span>
          </div>
          <button onClick={()=>handleLogout()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center">
           
          {isLoading == true ?
                
                <div role="status" className='flex justify-between items-center'>
                  <FiLogOut className="mr-2" />
    <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>

              
  :<><FiLogOut className="mr-2" />
  Logout</>  }
           
            
          </button>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-grow overflow-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-2xl ${
              message.role === "user" ? 'ml-auto' : 'mr-auto'
            } animate-fade-in`}
          >
            
            <div className={`rounded-2xl p-4 shadow-md ${
              message.role === "user" ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
            }`}>
              {message.role === "user" ? message.parts[0] : <TypingEffect text={message.parts[0]} />}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="max-w-xl mr-auto animate-fade-in">
            <div className="rounded-2xl p-4 shadow-md bg-white text-gray-800">
              {/* <TypingEffect text="...." /> */}
              <img src="typing.gif" alt="Logo" className="h-4 w-auto" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <footer className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-gray-100 border-none rounded-full px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 ease-in-out text-gray-700 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none"
            >
              <FiSend size={20} />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            DocuChat - Powered by Gemini
          </div>
        </div>
      </footer>
    </div>
  );
}