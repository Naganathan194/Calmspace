import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { useContext, useRef } from "react";
import LoginContext from "../../context/context";
import Articles from "../Articles/Articles";
import { FaChevronUp, FaBrain } from "react-icons/fa";
import { MdArticle, MdWavingHand, MdPsychology } from "react-icons/md";
import { PiChatsCircleFill } from "react-icons/pi";
import { BsGithub, BsYoutube } from "react-icons/bs";

function Homepage() {
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);

  const about = useRef(null);
  const articles = useRef(null);

  const aboutClick = () => {
    about.current?.scrollIntoView({ behavior: "smooth" });
  };
  const articlesClick = () => {
    articles.current?.scrollIntoView({ behavior: "smooth" });
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-purple-600 text-4xl">
              <MdPsychology />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CalmSpace</h1>
              <p className="text-xs text-gray-500">Mental health assistance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={aboutClick}
              className="text-gray-600 hover:text-purple-600 transition-colors px-3 py-2"
            >
              About
            </button>
            <button 
              onClick={articlesClick}
              className="text-gray-600 hover:text-purple-600 transition-colors px-3 py-2"
            >
              Articles
            </button>
            <button
                onClick={() => navigate("/games")}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors"
              >
               Games
              </button>
            {loggedIn && (
              <button
                onClick={() => navigate("/analysis")}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors"
              >
                Analysis
              </button>
            )}
            <button
              onClick={() => {
                if (!loggedIn) navigate("/login");
                else logoutUser();
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              {!loggedIn ? (
                <>Login <LuLogIn /></>
              ) : (
                <>Logout <LuLogOut /></>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
            Take care of your <span className="text-purple-600">mind</span> with AI support
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your personal AI companion for mental wellness. Confidential, supportive, and available anytime you need to talk.
          </p>
          <button 
            onClick={() => navigate("/message")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-medium py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            <PiChatsCircleFill /> Start chatting now
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md h-96 bg-white rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-300/20 to-blue-400/20"></div>
            <div className="absolute right-10 top-10 w-32 h-32 bg-purple-600 rounded-full opacity-20"></div>
            <div className="absolute left-10 bottom-10 w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
            <div className="absolute left-32 top-32 w-16 h-16 bg-pink-500 rounded-full opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center text-8xl text-purple-600 mb-6">
                  <MdPsychology />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">CalmSpace AI</h3>
                <p className="text-gray-500">Your mental wellness companion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        ref={about} 
        className="bg-gradient-to-r from-purple-800 to-indigo-800 py-16 text-white"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <div className="text-5xl mb-4">
              <MdWavingHand />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">About Us</h2>
            <div className="max-w-3xl text-center mb-8">
              <p className="text-lg leading-relaxed">
              ✨ Welcome to Your Safe Space – Where You’re Heard and Understood. 💙
              Feeling overwhelmed? Need someone who truly listens? We’re here for you. Our empathetic AI offers thoughtful support, meaningful guidance, and connects you with resources that matter. No judgment, just care. Whether it’s a tough day or a moment of uncertainty, you’re not alone. Let’s build a space where healing begins through open conversations. 🌸 You matter. Always. 🤗
              </p>
            </div>
            <Link 
              to="/aboutus" 
              className="inline-block bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full text-white font-medium transition-colors duration-300"
            >
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Mental Health Issues Are Common</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full bg-purple-100"></div>
                <div className="absolute inset-0 rounded-full border-8 border-t-purple-600 border-r-indigo-500 border-b-blue-500 border-l-pink-500 transform rotate-45"></div>
                <div className="absolute inset-8 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">1 in 5</div>
                    <div className="text-gray-500 mt-2">Adults experience mental illness each year</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Do You Know?</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mental health conditions are not uncommon. Hundreds of millions
                suffer from them yearly, and many more do over their lifetimes.
                It's estimated that 1 in 3 women and 1 in 5 men will experience
                major depression in their lives. Other conditions, such as
                schizophrenia and bipolar disorder, are less common but still have
                a large impact on people's lives.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">33%</div>
                  <div className="text-gray-500">of women experience depression</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-600">20%</div>
                  <div className="text-gray-500">of men experience depression</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section ref={articles} className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-12">
            <MdArticle className="text-3xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Editor's Picks</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Articles
              title="Mental Health in the Workplace"
              description="We've collected the best, tips, stats, and inspiring quotes on how to grow professionally while managing your mental health."
              Image={
                "https://images.ctfassets.net/zkw0qlnf0vqv/psycom_page_fid33077_asset_33076/bc369feafa88f58d0addfad648e3d361/Large_and_modern_office_interiors?fm=webp&fit=thumb&q=65&w=864&h=576"
              }
              link={"https://www.psycom.net/mental-health-work"}
            />
            <Articles
              title="How to Stop Negative Thoughts"
              description="Why your inner world has a natural tendency to go haywire and what to do about it."
              Image={
                "https://images.ctfassets.net/zkw0qlnf0vqv/psycom_page_fid31389_asset_31385/44d168240cb76bbbc6ec828143505f51/Conflict_Concept?fm=webp&fit=thumb&q=65&w=864&h=576"
              }
              link={"https://www.psycom.net/negative-thinking"}
            />
            <Articles
              title="What Is Imposter Syndrome?"
              description={`For starters, it is a real thing. And, if youve ever said or thought the words, "I'm fooling everyone. I feel like a fraud," you already have some experience with it.`}
              Image={
                "https://images.ctfassets.net/zkw0qlnf0vqv/psycom_page_fid33063_asset_33035/c6f05ce2b9f3f04fe328461176a4fc42/Deception_Concept_-_Disguise_Between_Shark_And_Goldfish?fm=webp&fit=thumb&q=65&w=864&h=576"
              }
              link={"https://www.psycom.net/imposter-syndrome"}
            />
            <Articles
              title="The Negativity Bias"
              description="What is the negativity bias? How can you overcome it?"
              Image={
                "https://images.ctfassets.net/zkw0qlnf0vqv/psycom_page_fid31958_asset_14576/87f8270d6f9b6abff590cc08c2d8c771/Seesaw_Scale_with_Emoticons_-_3D_Rendering?fm=webp&fit=thumb&q=65&w=864&h=576"
              }
              link={"https://www.psycom.net/negativity-bias"}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Our AI is here to listen, support, and guide you through your mental health challenges.
          </p>
          <button 
            onClick={() => navigate("/message")}
            className="bg-white text-purple-700 text-lg font-medium py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Start Chatting Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/aboutus" className="hover:text-purple-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <button onClick={articlesClick} className="hover:text-purple-400 transition-colors">
                    Articles
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/message")} className="hover:text-purple-400 transition-colors">
                    Chat
                  </button>
                </li>
                <button onClick={() => navigate("/games")} className="hover:text-purple-400 transition-colors">
                    Games
                  </button>
                {loggedIn && (
                  <li>
                    <button onClick={() => navigate("/analysis")} className="hover:text-purple-400 transition-colors">
                      Analysis
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/Naganathan194/Calmspace" 
                  target="_blank"
                  className="text-2xl hover:text-purple-400 transition-colors"
                >
                  <BsGithub />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p>© 2025 by TechBeez</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        onClick={scrollToTop}
      >
        <FaChevronUp />
      </button>
    </div>
  );
}

export default Homepage;