import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyle";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signup = ({ onSignupSuccess = null }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    const validation = validate();
    setErrors(validation);

    //if the validation occurs the function stops and error will be displayed
    if (Object.keys(validation).length) return;
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      };
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        setLoading(false);
        const errorMessage = await res.json();
        // console.log("errorMessage", errorMessage);
        setSubmitError(errorMessage?.message);
      } else {
        setLoading(false);
        const data = await res.json();
        if (data?.token) {
          // console.log("data:", data);
          localStorage.setItem("authToken", data?.token);
          localStorage.setItem(
            "currentUser",
            JSON.stringify(
              data.user || {
                name: name.trim(),
                email: email.trim().toLowerCase(),
              },
            ),
          );
        }

        if (typeof onSignupSuccess === "function")
          onSignupSuccess(
            data.user || {
              name: name.trim(),
              email: email.trim().toLowerCase(),
            },
          );
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setLoading(false);
      console.log("Error while signup:", err);
      setSubmitError("Network error occured");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={signupStyles.pageContainer}>
      {/* back button */}
      <Link to="/login" className={signupStyles.backButton}>
        <IoIosArrowBack className={signupStyles.backButtonIcon} />
        <span className={signupStyles.backButtonText}>Back</span>
      </Link>

      {/* signup form */}
      <div className={signupStyles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={signupStyles.animatedBorder}>
            <div className={signupStyles.formContent}>
              {/* heading */}
              <h2 className={signupStyles.heading}>
                <span className={signupStyles.headingIcon}>
                  <CiCircleCheck className={signupStyles.headingIconInner} />
                </span>
                <span className={signupStyles.headingText}>Create Account</span>
              </h2>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
