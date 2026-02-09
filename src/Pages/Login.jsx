import React, { useState } from "react";
import { loginStyles } from "../assets/dummyStyle";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosEyeOff, IoIosMail } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

const Login = ({ onLoginSuccess = null }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  //   const validate = () => {
  //     const e = {};
  //     if (!email) e.email = "Email is required";
  //     else if (!isValidEmail(email)) e.email = "Please enter a valid email";

  //     if (!password) e.password = "Password is required";
  //     return e;
  //   };
  const handleSubmit = () => {};
  return (
    <div className={loginStyles.pageContainer}>


      <Link to="/" className={loginStyles.backButton}>
        <IoIosArrowBack className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>Home</span>
      </Link>

      <div className={loginStyles.formContainer}>
        <form onSubmit={handleSubmit} className={loginStyles.form} noValidate>
          <div className={loginStyles.formWrapper}>
            <div className={loginStyles.animatedBorder}>
              <div className={loginStyles.formContent}>

                <h2 className={loginStyles.heading}>
                  <span className={loginStyles.headingIcon}>
                    <CiLogin className={loginStyles.headingIconInner} />
                  </span>
                  <span className={loginStyles.headingText}>Login</span>
                </h2>

                <p className={loginStyles.subtitle}>
                  Sign in to continue to Dev Spring. Solve, Practice, Run,
                  Improve
                </p>
               
                {/* email */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Email</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <IoIosMail className={loginStyles.inputIconInner} />
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
                      className={`${loginStyles.input} ${errors.email ? loginStyles.inputError : loginStyles.inputNormal}`}
                      placeholder="your@example.com"
                      required
                    />
                  </div>
                  {errors && errors.email && (
                    <p className={loginStyles.errorText}>{errors.email}</p>
                  )}
                </label>
                
                {/* password */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Password</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <RiLockPasswordFill
                        className={loginStyles.inputIconInner}
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
                      className={`${loginStyles.input} ${loginStyles.passwordInput} ${errors.password ? loginStyles.inputError : loginStyles.inputNormal}`}
                      placeholder="enter your password"
                      required
                    />
                    <button
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={loginStyles.passwordToggle}
                    >
                      {showPassword ? (
                        <IoIosEyeOff
                          className={loginStyles.passwordToggleIcon}
                        />
                      ) : (
                        <FaEye className={loginStyles.passwordToggleIcon} />
                      )}
                    </button>
                  </div>
                  {errors && errors.password && (
                    <p className={loginStyles.errorText}>{errors.password}</p>
                  )}
                </label>

                {submitError && (
                  <p className={loginStyles.submitError}>{submitError}</p>
                )}
                
                {/* signin and signup button */}
                <div className={loginStyles.buttonsContainer}>
                  <button
                    className={loginStyles.submitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      "signing in..."
                    ) : (
                      <>
                        <CiLogin className={loginStyles.submitButtonIcon} />
                        <span className={loginStyles.submitButtonText}>
                          Sign in
                        </span>
                      </>
                    )}
                  </button>
                  <div className={loginStyles.signupContainer}>
                    <div className={loginStyles.signupContent}>
                      <span className={loginStyles.signupText}>
                        Don't have an account?
                      </span>
                      <Link to="/signup" className={loginStyles.signupLink}>
                      Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
