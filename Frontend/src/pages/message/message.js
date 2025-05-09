import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import LoginContext from "../../context/context";
import { FiLogIn, FiLogOut, FiSend, FiBarChart2, FiMenu, FiMessageCircle } from "react-icons/fi";
import { RiMentalHealthFill, RiEyeCloseLine } from "react-icons/ri";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { IoGameControllerOutline } from "react-icons/io5"; // Added games icon
import Chat from "./Chat";
import AnimatedBackground from "./AnimatedBackground";
import styles from "./message.module.css";

function LoadingSpinner() {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
    </div>
  );
}

function Message() {
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);
  const mainRef = useRef();
  const [chat, setChat] = useState([]);
  const [chatState, setChatState] = useState("busy");
  const [chatInit, setChatInit] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  // Initialize darkMode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [suggestions, setSuggestions] = useState([
    "I've been feeling anxious lately",
    "How can I improve my sleep?",
    "Help me with stress management",
    "I need to talk about my feelings"
  ]);
  let ws = useRef(null);

  // Update localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('darkMode');
    } else {
      document.body.classList.remove('darkMode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (mainRef.current) {
      const container = mainRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [chat]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get(process.env.REACT_APP_API_LINK + "/chat", {
          withCredentials: true,
        });
        setChatId(data.data.chatId);
        console.log(data);
      } catch (error) {
        console.log("Error Fetching Data");
      }
    }
    fetchData();
  }, []);
  
  useEffect(() => {
    if (chatId !== null) {
      let wss = new WebSocket(`${process.env.REACT_APP_WS_LINK}?id=${chatId}`);
      wss.addEventListener("open", () => {
        console.log("Websocket connected");
        ws.current.send(JSON.stringify({ type: "client:connected" }));
        ws.current.send(JSON.stringify({ type: "client:chathist" }));
      });
      wss.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data?.type === "server:chathist") {
          const histdata = data?.data;
          if (!histdata) return;

          for (let conv of histdata) {
            if (conv.prompt) {
              setChat((prevchat) => [
                ...prevchat,
                { message: conv.prompt, own: true },
              ]);
            }
            if (conv.response) {
              setChat((prevchat) => [
                ...prevchat,
                { message: conv.response, own: false },
              ]);
            }
          }

          setChatState("idle");
          setChatInit(true);
        } else if (data?.type === "server:response:chunk") {
          setChat((prevchat) => {
            return [
              ...prevchat.slice(0, -1),
              {
                message: `${prevchat.at(prevchat.length - 1).message}${
                  data.chunk
                }`,
                own: false,
                isLoading: true,
              },
            ];
          });
        } else if (data?.type === "server:response:end") {
          setChat((prevchat) => {
            return [
              ...prevchat.slice(0, -1),
              {
                message: prevchat.at(prevchat.length - 1).message,
                own: false,
                isLoading: false,
              },
            ];
          });
          setChatState("idle");
        }
      });
      ws.current = wss;
    }
  }, [chatId]);

  const handleClick = (text = message) => {
    if (!text.trim()) return;
    
    setChat((prevchat) => [...prevchat, { message: text, own: true }]);
    console.log(text);
    ws.current?.send(
      JSON.stringify({
        type: "client:prompt",
        prompt: text,
      })
    );
    setMessage("");
    setChatState("busy");
    setChat((prevchat) => [
      ...prevchat,
      { message: "", own: false, isLoading: true },
    ]);
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/logout",
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data?.msg === "loggedout") {
        logout();
      }
    } catch (error) {
      console.log("Err in logout");
    }
  };

  return (
    <div className={`${styles.chatContainer} ${darkMode ? styles.darkMode : ''}`}>
      <AnimatedBackground />
      
      <div className={styles.sidebar}>
        <div className={styles.brand} onClick={() => navigate('/')}>
          <div className={styles.brandIcon}>
            <RiMentalHealthFill />
          </div>
          <div className={styles.brandText}>
            <h3>CalmSpace</h3>
            <p>Mental Health Assistant</p>
          </div>
        </div>
        
        <div className={styles.menuItems}>
          <button className={`${styles.menuButton} ${styles.activeButton}`}>
            <FiMessageCircle />
            <span>Chat</span>
          </button>
          
          <button 
            className={styles.menuButton}
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else navigate("/analysis");
            }}
          >
            <FiBarChart2 />
            <span>Analysis</span>
          </button>

          <button 
            className={styles.menuButton}
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else navigate("/games");
            }}
          >
            <IoGameControllerOutline />
            <span>Games</span>
          </button>
          
          <button 
            className={styles.menuButton}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          
          <button 
            className={`${styles.menuButton} ${styles.logoutButton}`}
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else logoutUser();
            }}
          >
            {!loggedIn ? <FiLogIn /> : <FiLogOut />}
            <span>{!loggedIn ? "Login" : "Logout"}</span>
          </button>
        </div>
      </div>
      
      <div className={styles.chatArea}>
        <header className={styles.chatHeader}>
          <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu />
          </button>
          
          <div className={styles.headerContent}>
            <div className={styles.headerAvatar}>
              <RiMentalHealthFill />
            </div>
            <div className={styles.headerInfo}>
              <h2>CalmSpace Assistant</h2>
              <p>Here to support your mental wellbeing</p>
            </div>
          </div>
          
          <button className={styles.darkModeToggle} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
          </button>
        </header>
        
        <main 
          ref={mainRef}
          className={`${styles.chatMessages} ${(!chatInit || chat.length === 0) ? styles.centerContent : ''}`}
        >
          {!chatInit && (
            <div className={styles.loadingContainer}>
              <LoadingSpinner />
              <p>Connecting to your personal CalmSpace...</p>
            </div>
          )}
          
          {chatInit && chat.length === 0 && (
            <div className={styles.emptyChat}>
              <div className={styles.emptyChatIcon}>
                <RiMentalHealthFill />
              </div>
              <h3>Welcome to CalmSpace</h3>
              <p>Your safe space to talk about your thoughts, feelings, and mental wellbeing. How are you feeling today?</p>
              
              <div className={styles.suggestionContainer}>
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index} 
                    className={styles.suggestionButton}
                    onClick={() => handleClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {chatInit &&
            chat &&
            chat.map((x, i) => (
              <Chat
                text={x.message}
                own={x.own}
                key={i}
                isLoading={x.isLoading ? true : false}
              />
            ))}
        </main>
        
        <div className={styles.messageInputContainer}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleClick();
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Express your thoughts freely..."
              disabled={chatState === "busy"}
            />
            <button
              type="submit"
              className={`${styles.sendButton} ${chatState === "busy" ? styles.disabled : ""}`}
              disabled={chatState === "busy"}
            >
              <FiSend />
            </button>
          </form>
          
          <div className={styles.privacyNote}>
            <RiEyeCloseLine />
            <span>Your conversations are private and secure</span>
          </div>
        </div>
      </div>
      
      {menuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileMenuHeader}>
              <div className={styles.brand}>
                <div className={styles.brandIcon}>
                  <RiMentalHealthFill />
                </div>
                <div className={styles.brandText}>
                  <h3>CalmSpace</h3>
                  <p>Mental Health Assistant</p>
                </div>
              </div>
              <button className={styles.closeMenu} onClick={() => setMenuOpen(false)}>×</button>
            </div>
            
            <div className={styles.menuItems}>
              <button className={`${styles.menuButton} ${styles.activeButton}`}>
                <FiMessageCircle />
                <span>Chat</span>
              </button>
              
              <button 
                className={styles.menuButton}
                onClick={() => {
                  if (!loggedIn) navigate("/login");
                  else {
                    navigate("/analysis");
                    setMenuOpen(false);
                  }
                }}
              >
                <FiBarChart2 />
                <span>Analysis</span>
              </button>
              
              <button 
                className={styles.menuButton}
                onClick={() => {
                  if (!loggedIn) navigate("/login");
                  else {
                    navigate("/games");
                    setMenuOpen(false);
                  }
                }}
              >
                <IoGameControllerOutline />
                <span>Games</span>
              </button>
              
              <button 
                className={styles.menuButton}
                onClick={() => {
                  setDarkMode(!darkMode);
                  setMenuOpen(false);
                }}
              >
                {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
              
              <button 
                className={`${styles.menuButton} ${styles.logoutButton}`}
                onClick={() => {
                  if (!loggedIn) navigate("/login");
                  else {
                    logoutUser();
                    setMenuOpen(false);
                  }
                }}
              >
                {!loggedIn ? <FiLogIn /> : <FiLogOut />}
                <span>{!loggedIn ? "Login" : "Logout"}</span>
              </button>
            </div>
            
            <div className={styles.mobileMenuFooter}>
              <div className={styles.privacyNote}>
                <RiEyeCloseLine />
                <span>Your conversations are private and secure</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;