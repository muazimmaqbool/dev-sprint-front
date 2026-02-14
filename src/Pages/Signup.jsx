import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyle";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosEyeOff, IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaUser } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";

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
                  <AiOutlineUserAdd className={signupStyles.headingIconInner} />
                </span>
                <span className={signupStyles.headingText}>Create Account</span>
              </h2>
              {/*subtitle */}
              <p className={signupStyles.subtitle}>
                Sign up to continue to Dev Sprint. Solve, Practice, Run, Improve
              </p>

              {/* form fields */}

              {/* name */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>Name</span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <FaUser className={signupStyles.inputIconInner} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors((prev) => ({
                          ...prev,
                          name: undefined,
                        }));
                      }
                    }}
                    className={`${signupStyles.input} ${errors.name ? signupStyles.inputError : signupStyles.inputNormal}`}
                    placeholder="Your full name"
                    required
                  />
                </div>
                {errors && errors.name && (
                  <p className={signupStyles.errorText}>{errors.name}</p>
                )}
              </label>

              {/* email */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>Email</span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <IoIosMail className={signupStyles.inputIconInner} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    className={`${signupStyles.input} ${errors.email ? signupStyles.inputError : signupStyles.inputNormal}`}
                    placeholder="your@example.com"
                    required
                  />
                </div>
                {errors && errors.email && (
                  <p className={signupStyles.errorText}>{errors.email}</p>
                )}
              </label>

              {/* password */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>Password</span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <RiLockPasswordFill
                      className={signupStyles.inputIconInner}
                    />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({
                          ...prev,
                          password: undefined,
                        }));
                      }
                    }}
                    className={`${signupStyles.input} ${signupStyles.passwordInput} ${errors.password ? signupStyles.inputError : signupStyles.inputNormal}`}
                    placeholder="enter your password"
                    required
                  />
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={signupStyles.passwordToggle}
                  >
                    {showPassword ? (
                      <IoIosEyeOff
                        className={signupStyles.passwordToggleIcon}
                      />
                    ) : (
                      <FaEye className={signupStyles.passwordToggleIcon} />
                    )}
                  </button>
                </div>
                {errors && errors.password && (
                  <p className={signupStyles.errorText}>{errors.password}</p>
                )}
              </label>

              {/* error message */}
              {submitError && (
                <p className={signupStyles.submitError} role="alert">
                  {submitError}
                </p>
              )}

              {/* button */}
              <div className={signupStyles.buttonsContainer}>
                <button
                  className={signupStyles.submitButton}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* if already have an acccount */}
        <div className={signupStyles.loginPromptContainer}>
          <div className={signupStyles.loginPromptContent}>
            <span className={signupStyles.loginPromptText}>
              Already have an account?
            </span>
            <Link to="/login" className={signupStyles.loginPromptLink}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
