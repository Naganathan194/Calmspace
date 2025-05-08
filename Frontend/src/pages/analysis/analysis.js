import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import LoginContext from "../../context/context";
import { IoArrowBackOutline } from "react-icons/io5";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { BsChatDots, BsArrowRightShort } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { Logo } from "../../svgs/logoSVG";

Chart.register(CategoryScale);

// Convert timestamp to formatted date
function timestampToDate(timestamp) {
  const date = new Date(timestamp);

  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

// Mental wellness score mapping
const scoreMapArr = [
  "Terrible",
  "Very Poor",
  "Poor",
  "Fair",
  "Below Average",
  "Average",
  "Above Average",
  "Good",
  "Very Good",
  "Excellent"
];

// New color scheme for scores - more vibrant
const scoreMapBgcolArr = [
  "#10B981", // Green variations
  "#34D399",
  "#6EE7B7",
  "#8B5CF6", // Purple variations
  "#A78BFA",
  "#C4B5FD",
  "#F59E0B", // Amber variations
  "#FBBF24",
  "#EF4444", // Red variations
  "#F87171",
];

// Text colors for readability against backgrounds
const scoreMapTxtcolArr = [
  "#fff", // White text for dark backgrounds
  "#000", // Black text for light backgrounds
  "#000",
  "#fff",
  "#000",
  "#000",
  "#000",
  "#000",
  "#fff",
  "#fff",
];

// Score Chart Component with new design
function ScoreChart({ dataset }) {
  let chartData = dataset
    .map((rep) => ({
      score: parseInt(rep.score),
      timestamp: rep.timestamp,
    }))
    ?.reverse();

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Mental Wellness",
        data: [],
        fill: true,
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "#8B5CF6",
        pointBackgroundColor: "#7C3AED",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#7C3AED",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if (dataset && dataset.length > 0) {
      const timestamps = chartData.map((data) =>
        new Date(data.timestamp).toLocaleDateString()
      );
      const scores = chartData.map((data) => data.score);

      setData({
        labels: timestamps,
        datasets: [
          {
            ...data.datasets[0],
            data: scores,
          },
        ],
      });
    }
  }, [dataset]);

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
        ticks: {
          display: true,
          color: "#94A3B8",
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        title: {
          display: false,
        },
        max: 10,
        min: 1,
        ticks: {
          stepSize: 1,
          display: true,
          color: "#94A3B8",
          font: {
            size: 10,
          },
          callback: function(value) {
            return scoreMapArr[value];
          }
        },
        grid: {
          color: "rgba(226, 232, 240, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#8B5CF6",
        borderWidth: 0,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `Score: ${scoreMapArr[context.raw]}`;
          }
        }
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="h-64 w-full p-4 bg-gray-900 rounded-xl">
      <Line data={data} options={options} />
    </div>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}

// Enhanced Analysis Details Component with improved styling
function AnalysisDetails({ curRep, handleBackToList }) {
  const [activeTab, setActiveTab] = useState('analysis');
  
  if (!curRep) return null;

  return (
    <div className="relative p-4 md:p-8">
      {/* Background blur element with pattern overlay for glassmorphism effect */}
      <div className="absolute inset-0 bg-pattern-dark opacity-5 z-0"></div>
      
      {/* Back button */}
      <button
        onClick={handleBackToList}
        className="mb-6 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200 relative z-10"
      >
        <IoArrowBackOutline size={18} className="mr-2" />
        <span>Back to reports</span>
      </button>
      
      {/* Score and date header with glassmorphism effect */}
      <div className="relative mb-8 z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          {/* Score card with glow effect */}
          <div className="flex items-center backdrop-blur-md bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 shadow-xl glow-purple">
            <div 
              className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center mr-6 text-2xl md:text-3xl font-bold shadow-lg animate-pulse-purple"
              style={{ 
                backgroundColor: scoreMapBgcolArr[curRep.score],
                color: scoreMapTxtcolArr[curRep.score]
              }}
            >
              {parseInt(curRep.score)}
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {scoreMapArr[curRep.score]}
              </h3>
              <p className="text-gray-300 mt-1">Wellness Score</p>
            </div>
          </div>
          
          {/* Date display with subtle glassmorphism */}
          <div className="backdrop-blur-sm bg-gray-800/30 px-5 py-3 rounded-xl text-sm text-gray-300 border border-gray-700/50 flex items-center self-start">
            <FaRegCalendarAlt className="mr-2" size={14} />
            {timestampToDate(curRep.timestamp)}
          </div>
        </div>
      </div>
      
      {/* Tab navigation with enhanced styling */}
      <div className="flex space-x-2 mb-4 relative z-10">
        <button 
          className={`px-5 py-2 rounded-t-lg transition-all duration-200 flex items-center ${
            activeTab === 'analysis' 
              ? 'bg-purple-900/60 text-purple-200 border-b-2 border-purple-500' 
              : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800/60 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('analysis')}
        >
          <IoAnalyticsOutline className="mr-2" size={16} />
          Insights & Recommendations
        </button>
        <button 
          className={`px-5 py-2 rounded-t-lg transition-all duration-200 flex items-center ${
            activeTab === 'indicators' 
              ? 'bg-purple-900/60 text-purple-200 border-b-2 border-purple-500' 
              : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800/60 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('indicators')}
        >
          <BsChatDots className="mr-2" size={14} />
          Emotional Patterns
        </button>
      </div>
      
      {/* Content container with enhanced glassmorphism */}
      <div className="backdrop-blur-md bg-gray-800/30 rounded-2xl border border-gray-700/50 shadow-lg relative z-10 overflow-hidden">
        {activeTab === 'analysis' && (
          <div className="p-6 md:p-8">
            {/* Insights header with icon */}
            <div className="flex items-center mb-6">
              <div className="bg-purple-900/40 p-3 rounded-lg mr-4">
                <IoAnalyticsOutline size={24} className="text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Mental Wellness Analysis</h3>
            </div>
            
            {/* Styled markdown content with improved readability */}
            <div className="prose prose-invert max-w-none">
              {/* Format the analysis content with better styling */}
              <div className="space-y-6">
                {curRep.analysis.split('\n\n').map((paragraph, idx) => {
                  // Check if paragraph is a header (starts with # or ##)
                  if (paragraph.startsWith('# ') || paragraph.startsWith('## ')) {
                    const headerText = paragraph.replace(/^#+ /, '');
                    return (
                      <div key={idx} className="mt-8 mb-4">
                        <h3 className="text-xl font-semibold text-purple-200 border-b border-purple-800/50 pb-2">
                          {headerText}
                        </h3>
                      </div>
                    );
                  }
                  
                  // Check if paragraph is a bullet point
                  if (paragraph.trim().startsWith('* ') || paragraph.trim().startsWith('- ')) {
                    return (
                      <div key={idx} className="flex items-start ml-4 mb-3">
                        <div className="h-2 w-2 rounded-full bg-purple-500 mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-300">{paragraph.replace(/^[*-] /, '')}</p>
                      </div>
                    );
                  }
                  
                  // Regular paragraph with card-like styling
                  return (
                    <div key={idx} className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/30">
                      <p className="text-gray-300">{paragraph}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'indicators' && (
          <div className="p-6 md:p-8">
            {/* Improved header with icon for emotional patterns */}
            <div className="flex items-center mb-6">
              <div className="bg-purple-900/40 p-3 rounded-lg mr-4">
                <BsChatDots size={24} className="text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Emotional Patterns</h3>
            </div>
            
            {/* Description */}
            <p className="text-gray-400 mb-6">Key emotional themes identified in your recent conversations:</p>
            
            {/* Enhanced tag display with animations and categories */}
            <div className="flex flex-wrap gap-3">
              {curRep.keywords.map((kw, index) => (
                <span 
                  key={kw} 
                  className="px-6 py-3 bg-purple-900/40 text-purple-200 border border-purple-700/50 rounded-xl text-sm font-medium backdrop-blur-sm shadow-md hover:bg-purple-800/50 transition-all duration-200 cursor-default transform hover:-translate-y-1"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeIn 0.5s ease-out forwards"
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
            
            {/* Additional insights section */}
            <div className="mt-8 bg-gray-800/30 p-4 rounded-xl border border-gray-700/40">
              <h4 className="text-purple-300 font-medium mb-2">Pattern Significance</h4>
              <p className="text-gray-400 text-sm">
                These emotional patterns reflect recurring themes in your conversations. 
                They help identify your current emotional state and areas that may benefit from attention.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Analysis() {
  const navigate = useNavigate();
  const [curState, setCurState] = useState("loading");
  const [curRep, setCurRep] = useState(null);
  const [analysisHist, setAnalysisHist] = useState([]);
  const [fetchNew, setFetchNew] = useState(false);
  const { logout, loggedIn } = useContext(LoginContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_API_LINK + "/fetchanalysis",
          {
            withCredentials: true,
          }
        );

        setAnalysisHist(data.data);
        setCurState("list");
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setCurState("list"); // Fallback to list view even on error
      }
    }
    fetchData();
  }, []);

  async function fetchNewAnalysis() {
    setFetchNew(true);
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/analysis",
        {
          withCredentials: true,
        }
      );
      
      if (data.msg === "nochatdata") {
        setCurState("nochatdata");
      }
      if (data?.data) {
        setAnalysisHist((prev) => {
          let cur = [...prev];
          cur.unshift({ ...data.data, new: true });
          return cur;
        });
      }
    } catch (error) {
      console.error("Error generating new analysis:", error);
    } finally {
      setFetchNew(false);
    }
  }

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/logout",
        {
          withCredentials: true,
        }
      );
      if (data?.msg === "loggedout") {
        logout();
      }
    } catch (error) {
      console.log("Error in logout");
    }
  };

  // Function to go back to list view
  const handleBackToList = () => {
    setCurState("list");
    setCurRep(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header - Dark Theme */}
      <nav className="border-b border-gray-800 px-6 py-4 backdrop-blur-md bg-gray-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="text-purple-500">
              <Logo />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CalmSpace</h1>
              <p className="text-xs text-gray-400">Mental health companion</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {loggedIn && (
              <button
                onClick={() => navigate("/message")}
                className="px-4 py-2 text-sm font-medium text-purple-200 bg-purple-900/90 backdrop-blur-sm rounded-md hover:bg-purple-800 transition-colors duration-200 flex items-center shadow-md"
              >
                <BsChatDots className="mr-2" size={16} />
                Chat
              </button>
            )}
            <button
              onClick={() => {
                if (!loggedIn) navigate("/login");
                else logoutUser();
              }}
              className="p-2 text-gray-300 bg-gray-800/80 backdrop-blur-sm rounded-md hover:bg-gray-700 transition-colors duration-200 shadow-md"
              aria-label={!loggedIn ? "Login" : "Logout"}
            >
              {!loggedIn ? <LuLogIn size={18} /> : <LuLogOut size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content with glassmorphism theme */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <IoAnalyticsOutline className="mr-3 text-purple-500" />
              Mental Wellness Analytics
            </h2>
            {curState === "details" && (
              <button
                onClick={handleBackToList}
                className="p-2 bg-gray-800/60 backdrop-blur-sm rounded-md hover:bg-gray-700/80 transition-colors duration-200 text-gray-300 md:hidden"
                aria-label="Back to list"
              >
                <IoArrowBackOutline size={18} />
              </button>
            )}
          </div>

          {/* Chart section with glassmorphism */}
          {analysisHist.length > 0 && (
            <div className="mb-8">
              <p className="text-gray-400 mb-3 text-sm">Wellness Score Trends</p>
              <div className="backdrop-blur-md bg-gray-800/30 p-2 rounded-2xl border border-gray-700/50 shadow-lg">
                <ScoreChart dataset={analysisHist} />
              </div>
            </div>
          )}
        </div>

        {/* Action button with enhanced styling */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={fetchNewAnalysis}
            disabled={fetchNew}
            className={`px-6 py-3 rounded-lg font-medium shadow-lg flex items-center space-x-2 transition-all duration-300 ${
              fetchNew 
                ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                : "bg-purple-600/90 backdrop-blur-sm text-white hover:bg-purple-700 hover:scale-105 glow-purple"
            }`}
          >
            {fetchNew ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin mr-2"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-2" size={16} />
                <span>Generate New Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Content section with glassmorphism */}
        <div className="backdrop-blur-md bg-gray-800/20 rounded-2xl overflow-hidden border border-gray-700/50 shadow-lg">
          {curState === "loading" && <LoadingSpinner />}

          {curState === "nochatdata" && (
            <div className="p-12 text-center">
              <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-purple-900/50 backdrop-blur-sm shadow-lg">
                <BsChatDots size={32} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No Chat History Found</h3>
              <p className="text-gray-400">Chat with our assistant first to generate an analysis.</p>
              <button 
                onClick={() => navigate('/message')} 
                className="mt-6 px-6 py-3 bg-purple-600/90 backdrop-blur-sm text-white rounded-md hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-px"
              >
                Start Chatting
              </button>
            </div>
          )}

          {curState === "list" && analysisHist.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-purple-900/50 backdrop-blur-sm shadow-lg">
                <IoAnalyticsOutline size={32} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No Reports Yet</h3>
              <p className="text-gray-400">Click "Generate New Analysis" to create your first wellness report.</p>
            </div>
          )}

          {curState === "list" && analysisHist.length > 0 && (
            <div className="grid gap-3 p-4">
              {analysisHist.map((rep, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurRep(analysisHist[i]);
                    setCurState("details");
                  }}
                  className={`p-4 backdrop-blur-md rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg card-hover ${
                    analysisHist[i]?.new 
                      ? "border-l-4 border-l-purple-500 bg-gray-750/60" 
                      : "border border-gray-700/50 bg-gray-850/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="h-16 w-16 rounded-full flex items-center justify-center mr-4 text-xl font-bold shadow-lg" 
                        style={{ 
                          backgroundColor: scoreMapBgcolArr[rep.score],
                          color: scoreMapTxtcolArr[rep.score]
                        }}
                      >
                        {parseInt(rep.score)}
                      </div>
                      <div>
                        <div className={`text-lg font-medium ${analysisHist[i]?.new ? "text-purple-300" : "text-white"}`}>
                          {scoreMapArr[rep.score]} {analysisHist[i]?.new && <span className="text-xs bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded-full ml-2 font-semibold">NEW</span>}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <FaRegCalendarAlt className="mr-1" size={12} />
                          {timestampToDate(rep.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-purple-500 bg-purple-900/30 p-2 rounded-full">
                      <BsArrowRightShort size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {curState === "details" && curRep && (
            <AnalysisDetails 
              curRep={curRep}
              handleBackToList={handleBackToList}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Analysis;