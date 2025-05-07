import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import styles from "./login.module.css";
import InputBox from "../../components/inputBox/inputBox";
import Button from "../../components/button/button";
import GoogleIcon from "../../svgs/googleicon.png";
import {
  LoginWithEmail,
  LoginWithGoogle,
  SignupWithEmail,
} from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import LoginContext from "../../context/context";

function Login() {
  const [isRegistered, setIsRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useContext(LoginContext)
  
  useEffect(() => {
    if (isRegistered === true) {
      setError({
        email: "",
        password: "",
      });
    } else {
      setError({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [isRegistered]);

  const handleLoginDataChange = (e, text) => {
    setLoginError(false)
    const change = e.target.value;
    setLoginData((d) => {
      d[text] = change;
      return { ...d };
    });
  };
  
  const handleLoginWithGoogle = () => {
    async function loginGoogle() {
      try {
        const res = await LoginWithGoogle();
        if (res) {
          setLoggedIn(true);
        }
      } catch (error) {
        // Error handling
      }
    }
    loginGoogle();
  }
  
  const LoginandSignup = async (e) => {
    try {
      if (isRegistered) {
        const login = await LoginWithEmail(loginData.email, loginData.password);
        setLogging(false);
        setLoggedIn(true);
      } else {
        const Signup = await SignupWithEmail(
          loginData.email,
          loginData.password
        );
        setLogging(false);
        setLoggedIn(true);
      }
    } catch (error) {
      setLoginError(true);
      if (isRegistered)
        toast.error("Invalid credentials", {
          position: "top-right"
        });
      else {
        toast.error("Error creating account", {
          position: "top-right"
        });
      }
      setErrorMessage(error.message)
      setLogging(false);
    }
  };
  
  const handleSubmitButton = (e) => {
    e.preventDefault();

    if (!isRegistered) {
      if (loginData.email === "" || loginData.password === "") {
        toast.error("Please enter all the fields", {
          position: "top-right"
        });
        return;
      }
    }

    if (isRegistered && (loginData.email === "" || loginData.password === "")) {
      toast.error("Please enter all the fields", {
          position: "top-right"
        });
      return;
    }
    else {
      const isCorrectMail = loginData.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      if (!isCorrectMail) {
        toast.error("Please enter a correct email", {
          position: "top-right"
        });
        return;
      }
      else if (!isRegistered && loginData.password.length < 8) {
        toast.error("Please enter a longer password", {
          position: "top-right"
        });
        return;
      }
    }

    setLogging(true);
    LoginandSignup();
  };
  
  useEffect(() => {
    if (loggedIn) {
      login()
      navigate("/message")
    };
  }, [loggedIn]);
  
  useEffect(() => {
    if (Object.keys(error).length === 0) {
      // Logic when error is empty
    }
  }, [error]);
  
  // Generate particles for right panel
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push(<div key={i} className={styles.particle}></div>);
    }
    return particles;
  };
  
  return (
    <div className={styles.pageContainer}>
      <ToastContainer />
      <div className={styles.pageContent}>
        <div className={styles.leftContainer}>
          {/* Left panel decorative background */}
          <div className={styles.leftBackground}>
            <div className={styles.patternDots}></div>
          </div>
          
          <div className={styles.loginContainer}>
            <header>
              <h2>
                {isRegistered ? "Welcome Back" : "Create Account"} <span>{isRegistered ? "✨" : "🚀"}</span>
              </h2>
            </header>
            <main>
              <InputBox
                label="Email"
                name="email"
                type="email"
                disabled={isLoading}
                value={loginData.email}
                handleChange={handleLoginDataChange}
                placeholder="your@email.com"
              />

              <InputBox
                label="Password"
                name="password"
                type="password"
                disabled={isLoading}
                value={loginData.password}
                handleChange={handleLoginDataChange}
                placeholder="Your secure password"
              />
              
              <Button
                text={isRegistered ? "Log In" : "Create Account"}
                type="submit"
                handleClick={handleSubmitButton}
                logging={logging}
                style={{
                  backgroundColor: isRegistered ? "#6366f1" : "#8b5cf6",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  marginTop: "0.5rem"
                }}
              />
              
              <div className={styles.divider}>
                <span>or continue with</span>
              </div>
              
              <div
                className={styles.googleButton}
                onClick={() => {
                  handleLoginWithGoogle();
                }}
              >
                <img src={GoogleIcon} alt="Google" className={styles.googleImage} />
                <div>Google</div>
              </div>
            </main>
            <footer>
              {isRegistered
                ? "Don't have an account yet?"
                : "Already have an account?"}{" "}
              <span
                onClick={() => {
                  setIsRegister((value) => !value);
                  setLoginData({
                    name: "",
                    email: "",
                    password: "",
                  });
                }}
              >
                {isRegistered ? "Sign up" : "Log in"}
              </span>
            </footer>
          </div>
        </div>
        <div className={styles.rightContainer}>
          {/* 3D card elements */}
          <div className={`${styles.card3d} ${styles.card1}`}></div>
          <div className={`${styles.card3d} ${styles.card2}`}></div>
          <div className={`${styles.card3d} ${styles.card3}`}></div>
          
          {/* Decorative elements */}
          <div className={styles.decorativeElements}>
            <div className={`${styles.circle} ${styles.circle1}`}></div>
            <div className={`${styles.circle} ${styles.circle2}`}></div>
            <div className={`${styles.circle} ${styles.circle3}`}></div>
            <div className={`${styles.circle} ${styles.circle4}`}></div>
            <div className={`${styles.circle} ${styles.circle5}`}></div>
            <div className={styles.wave}></div>
          </div>
          
          {/* Particles effect */}
          <div className={styles.particles}>
            {renderParticles()}
          </div>
          
          {/* Welcome text */}
          <div className={styles.welcomeText}>
            <h1>{isRegistered ? "Welcome Back!" : "Join Us Today!"}</h1>
            <p>
              {isRegistered 
                ? "Log in to access your account and continue your journey with us." 
                : "Create an account to get started and explore everything we have to offer."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;