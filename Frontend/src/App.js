import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/homepage";
import LoginPage from "./pages/login/login";
import Message from "./pages/message/message";
import { useContext, useEffect } from "react";
import { Cookies, useCookies } from "react-cookie";
import axios from "axios";
import LoginContext from "./context/context";
import { PrivateRoute } from "./components/router/PrivateRouter";
import { PrivateRouteAnalysis } from "./components/router/PrivateRouterAnalysis";
import Analysis from "./pages/analysis/analysis";
import Error from "./pages/error/error";
import AboutPage from "./pages/AboutUs/AboutPage";
import Games from './pages/Games/Games';
import ColorHunter from './pages/Games/components/ColorHunter';
import FindOut from './pages/Games/components/FindOut';
import OddOneOut from './pages/Games/components/OddOneOutGame'; 

function App() {
  const { login } = useContext(LoginContext);
  useEffect(() => {
    async function isUser() {
      try {
        const user = await axios.get(
          process.env.REACT_APP_API_LINK + "/isUser",
          {
            withCredentials: true,
          }
        );
        if (user) {
          console.log("Yes");
          login();
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    isUser();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PrivateRoute>
              <LoginPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Homepage />} />
        <Route path="/message" element={<Message />} />
        <Route
          path="/analysis"
          element={
            <PrivateRouteAnalysis>
              <Analysis />
            </PrivateRouteAnalysis>
          }
        />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="*" element={<Error />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/color-hunter" element={<ColorHunter />} />
        <Route path="/games/find-out" element={<FindOut />} />
        <Route path="/games/odd-one-out" element={<OddOneOut />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
