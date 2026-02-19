import React, { useEffect, useRef, useState } from "react";
import { sidebarStyles } from "../assets/dummyStyle";
import questionsData from "../assets/questions";
import { toast } from "react-toastify";
import axios from "axios";
import { FiBookOpen, FiZap } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { technologies } from "../assets/technologies";
import { FaChevronDown, FaChevronRight, FaRegStar } from "react-icons/fa";
import { levels } from "../assets/levels";
import { BiAward, BiCheckCircle, BiMenu, BiTargetLock, BiXCircle } from "react-icons/bi";
import { GiSparkles } from "react-icons/gi";

const SideBar = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const submittedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const asideRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  //if the innner width is >= 768px then sidebar will be visible else it will be toggle button to open/close sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //if sidebar is open and width is < 768px then sidebar will collapse
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isSidebarOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  //used to select the tech
  const handleTechSelect = (techId) => {
    if (selectedTech === techId) {
      setSelectedTech(null);
      setSelectedLevel(null);
    } else {
      setSelectedTech(techId);
      setSelectedLevel(null);
    }
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;

    if (window.innerWidth < 768) setIsSidebarOpen(true);

    setTimeout(() => {
      const el = asideRef.current?.querySelector(`[data-tech="${techId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  //used to select level
  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;

    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  //used to handle answer submit
  const handleAnswerSubmit = (answerIndex) => {
    const newAnswers = {
      ...userAnswers,
      [currentQuestion]: answerIndex,
    };
    setUserAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion < getQuestions().length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  //function to getQuestions:
  const getQuestions = () => {
    if (!selectedTech || !selectedLevel) return [];
    return questionsData[selectedTech]?.[selectedLevel] || [];
  };

  //calculating total score
  const calculateScore = () => {
    const questions = getQuestions();
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length
        ? Math.round((correct / questions.length) * 100)
        : 0,
    };
  };

  //reset
  const reset = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];
  const score = calculateScore();

  const getPerformanceStatus = () => {
    if (score.percentage >= 90)
      return {
        text: "Outstanding!",
        color: "bg-gradient-to-r from-amber-200 to-amber-300",
        //icon: <Sparkles className="text-amber-800" />,
      };
    if (score.percentage >= 75)
      return {
        text: "Excellent!",
        color: "bg-gradient-to-r from-blue-200 to-indigo-200",
        //icon: <Trophy className="text-blue-800" />,
      };
    if (score.percentage >= 60)
      return {
        text: "Good Job!",
        color: "bg-gradient-to-r from-green-200 to-teal-200",
        //icon: <Award className="text-green-800" />,
      };
    return {
      text: "Keep Practicing",
      color: "bg-gradient-to-r from-gray-200 to-gray-300",
      //icon: <BookOpen className="text-gray-800" />,
    };
  };
  const performance = getPerformanceStatus();

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken") || null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  const submitResult = async () => {
    if (!submittedRef.current) return;
    if (!selectedTech || !selectedLevel) return;

    const payload = {
      title: `${selectedTech.toUpperCase()} - ${
        selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
      } quiz`,
      technology: selectedTech,
      level: selectedLevel,
      totalQuestions: score.total,
      correct: score.correct,
      wrong: score.total - score.correct,
    };
    try {
      submittedRef.current = true;
      toast.info("Saving your result...");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/results`,
        payload,
        {
          header: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          timeout: 10000,
        },
      );
      if (res.ok) {
        toast.success("Result saved!");
      } else {
        toast.warn("Result not saved...");
        submittedRef.current = false;
      }
    } catch (err) {
      submittedRef.current = false;
      console.error(
        "Error saving result:",
        err?.response?.data || err.message || err,
      );
      toast.error("Could not save result. Check console or network.");
    }
  };
  useEffect(() => {
    if (showResults) {
      submitResult();
    }
  }, [showResults]);

  return (
    <div>
      {isSidebarOpen && (
        <div
          className={sidebarStyles.mobileOverlay}
          onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={sidebarStyles.mainContainer}>
        <aside
          ref={asideRef}
          className={`${sidebarStyles.sidebar} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* header section */}
          <div className={sidebarStyles.sidebarHeader}>
            <div className={sidebarStyles.headerDecoration1}></div>
            <div className={sidebarStyles.headerDecoration2}></div>

            {/* header text*/}
            <div className={sidebarStyles.headerContent}>
              <div className={sidebarStyles.logoContainer}>
                <div className={sidebarStyles.logoIcon}>
                  <FiBookOpen size={28} className="text-indigo-700" />
                </div>
                <div>
                  <h1 className={sidebarStyles.logoTitle}>Dev Quiz</h1>
                  <p className={sidebarStyles.logoSubtitle}>
                    Test and improve your skills
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className={sidebarStyles.closeButton}
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          {/* side bar content section */}
          <div className={sidebarStyles.sidebarContent}>
            <div className={sidebarStyles.technologiesHeader}>
              <h2 className={sidebarStyles.technologiesTitle}>Technologies</h2>
              <span className={sidebarStyles.technologiesCount}>
                {technologies.length} Options
              </span>
            </div>
            {/* technologies list */}
            {technologies &&
              technologies.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div key={tech.id} className={sidebarStyles.techItem}>
                    <button
                      onClick={() => handleTechSelect(tech.id)}
                      className={`${sidebarStyles.techButton}
                ${selectedTech === tech.id ? `${tech.color} ${sidebarStyles.techButtonSelected}` : sidebarStyles.techButtonNormal}`}
                    >
                      <div className={sidebarStyles.techButtonContent}>
                        <span
                          className={`${sidebarStyles.techIcon} ${tech.color}`}
                        >
                          <Icon size={20} />
                        </span>
                        <span className={sidebarStyles.techName}>
                          {tech.name}
                        </span>
                      </div>

                      {selectedTech === tech.id ? (
                        <FaChevronDown size={18} className="text-current" />
                      ) : (
                        <FaChevronRight size={18} className="text-gray-400" />
                      )}
                    </button>
                    {selectedTech === tech.id && (
                      <div className={sidebarStyles.levelsContainer}>
                        <h3 className={sidebarStyles.levelsTitle}>
                          <span>Select Difficulty</span>
                          <span className={sidebarStyles.techBadge}>
                            {
                              technologies.find((t) => t.id === selectedTech)
                                .name
                            }
                          </span>
                        </h3>

                        {levels.map((level) => {
                          const Icon = level.icon;
                          return (
                            <button
                              key={level.id}
                              onClick={() => handleSelectLevel(level.id)}
                              className={`${sidebarStyles.levelButton} ${selectedLevel === level.id ? `${level.color} ${sidebarStyles.levelButtonSelected}` : sidebarStyles.levelButtonNormal}`}
                            >
                              <div className={sidebarStyles.levelButtonContent}>
                                <span
                                  className={`${sidebarStyles.levelIcon}
                                ${selectedLevel === level.id ? "bg-white/40" : "bg-gray-100"}
                                `}
                                >
                                  <Icon size={16} />
                                </span>
                                <span>{level.name}</span>
                              </div>
                              <span className={sidebarStyles.levelQuestions}>
                                {level.questions}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/*side bar footer*/}
          <div className={sidebarStyles.sidebarFooter}>
            <div className={sidebarStyles.footerContent}>
              <div className={sidebarStyles.footerContentCenter}>
                <p>Master your skills one quiz at a time</p>
                <p className={sidebarStyles.footerHighlight}>
                  Keep learning and keep improving
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* QUESTION AND ANSWER ALSO RESULT */}
        <main className={sidebarStyles.mainContent}>
          <div className={sidebarStyles.mobileHeader}>
            <button
              onClick={toggleSidebar}
              className={sidebarStyles.menuButton}
            >
              <BiMenu size={20} />
            </button>

            <div className={sidebarStyles.mobileTitle}>
              {selectedTech ? (
                <div className={sidebarStyles.mobileTechInfo}>
                  <div
                    className={`${sidebarStyles.mobileTechIcon} ${
                      technologies.find((t) => t.id === selectedTech).color
                    }`}
                  >
                    {technologies.find((t) => t.id === selectedTech).icon}
                  </div>
                  <div className={sidebarStyles.mobileTechText}>
                    <div className={sidebarStyles.mobileTechName}>
                      {technologies.find((t) => t.id === selectedTech).name}
                    </div>
                    <div className={sidebarStyles.mobileTechLevel}>
                      {selectedLevel
                        ? `${
                            selectedLevel.charAt(0).toUpperCase() +
                            selectedLevel.slice(1)
                          } level`
                        : "Select level"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={sidebarStyles.mobilePlaceholder}>
                  Select a technology from the menu
                </div>
              )}
            </div>
          </div>

          {selectedTech && !selectedLevel && (
            <div className={sidebarStyles.mobileLevels}>
              <div className={sidebarStyles.mobileLevelsContainer}>
                {levels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLevel(l.id)}
                    className={sidebarStyles.mobileLevelButton}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!selectedTech ? (
            <div className={sidebarStyles.welcomeContainer}>
              <div className={sidebarStyles.welcomeContent}>
                <div className={sidebarStyles.welcomeIcon}>
                  <BiAward size={64} className="text-indigo-700" />
                </div>
                <h2 className={sidebarStyles.welcomeTitle}>
                  Welcome to Tech Quiz Master
                </h2>
                <p className={sidebarStyles.welcomeDescription}>
                  Select a technology from the sidebar to start your quiz
                  journey. Test your knowledge at basic, intermediate, or
                  advanced levels.
                </p>

                <div className={sidebarStyles.featuresGrid}>
                  <div className={sidebarStyles.featureCard}>
                    <div className={sidebarStyles.featureIcon}>
                      <FaRegStar size={20} />
                    </div>
                    <h3 className={sidebarStyles.featureTitle}>
                      Multiple Technologies
                    </h3>
                    <p className={sidebarStyles.featureDescription}>
                      HTML, CSS, JavaScript, React, and more
                    </p>
                  </div>

                  <div className={sidebarStyles.featureCard}>
                    <div className={sidebarStyles.featureIcon}>
                      <FiZap size={20} />
                    </div>
                    <h3 className={sidebarStyles.featureTitle}>
                      Three Difficulty Levels
                    </h3>
                    <p className={sidebarStyles.featureDescription}>
                      Basic, Intermediate, and Advanced challenges
                    </p>
                  </div>

                  <div className={sidebarStyles.featureCard}>
                    <div className={sidebarStyles.featureIcon}>
                      <BiTargetLock size={20} />
                    </div>
                    <h3 className={sidebarStyles.featureTitle}>
                      Instant Feedback
                    </h3>
                    <p className={sidebarStyles.featureDescription}>
                      Get detailed results and performance analysis
                    </p>
                  </div>
                </div>

                <div className={sidebarStyles.welcomePrompt}>
                  <p className={sidebarStyles.welcomePromptText}>
                    <GiSparkles size={16} className="mr-2" />
                    Select any technology to begin your learning adventure!
                  </p>
                </div>
              </div>
            </div>
          ) : !selectedLevel ? (
            <div className={sidebarStyles.levelSelectionContainer}>
              <div className={sidebarStyles.levelSelectionContent}>
                <div
                  className={`${sidebarStyles.techSelectionIcon} ${
                    technologies.find((t) => t.id === selectedTech).color
                  }`}
                >
                  {technologies.find((t) => t.id === selectedTech).icon}
                </div>
                <h2 className={sidebarStyles.techSelectionTitle}>
                  {technologies.find((t) => t.id === selectedTech).name} Quiz
                </h2>
                <p className={sidebarStyles.techSelectionDescription}>
                  Select a difficulty level to begin your challenge
                </p>

                <div className={sidebarStyles.techSelectionPrompt}>
                  <p className={sidebarStyles.techSelectionPromptText}>
                    Get ready to test your{" "}
                    {technologies.find((t) => t.id === selectedTech).name}{" "}
                    knowledge!
                  </p>
                </div>
              </div>
            </div>
          ) : showResults ? (
            <div className={sidebarStyles.resultsContainer}>
              <div className={sidebarStyles.resultsContent}>
                <div className={sidebarStyles.resultsHeader}>
                  <div
                    className={`${sidebarStyles.performanceIcon} ${performance.color}`}
                  >
                    {performance.icon}
                  </div>
                  <h2 className={sidebarStyles.resultsTitle}>
                    Quiz Completed!
                  </h2>
                  <p className={sidebarStyles.resultsSubtitle}>
                    You've completed the {selectedLevel} level
                  </p>
                  <div
                    className={`${sidebarStyles.performanceBadge} ${performance.color}`}
                  >
                    {performance.text}
                  </div>

                  <div className={sidebarStyles.scoreGrid}>
                    <div className={sidebarStyles.scoreCard}>
                      <div className={sidebarStyles.scoreIcon}>
                        <BiCheckCircle size={24} />
                      </div>
                      <p className={sidebarStyles.scoreNumber}>
                        {score.correct}
                      </p>
                      <p className={sidebarStyles.scoreLabel}>
                        Correct Answers
                      </p>
                    </div>

                    <div className={sidebarStyles.scoreCard}>
                      <div className={sidebarStyles.scoreIcon}>
                        <BiXCircle size={24} />
                      </div>
                      <p className={sidebarStyles.scoreNumber}>
                        {score.total - score.correct}
                      </p>
                      <p className={sidebarStyles.scoreLabel}>
                        Incorrect Answers
                      </p>
                    </div>
                  </div>

                  <div className={sidebarStyles.scoreProgress}>
                    <div className={sidebarStyles.scoreProgressHeader}>
                      <span className={sidebarStyles.scoreProgressTitle}>
                        Overall Score
                      </span>
                      <span className={sidebarStyles.scoreProgressPercentage}>
                        {score.percentage}%
                      </span>
                    </div>
                    <div className={sidebarStyles.scoreProgressBar}>
                      <div
                        className={`${sidebarStyles.scoreProgressFill} ${
                          score.percentage >= 80
                            ? "bg-green-400"
                            : score.percentage >= 60
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${score.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentQ ? (
            <div className={sidebarStyles.quizContainer}>
              <div className={sidebarStyles.quizHeader}>
                <div className={sidebarStyles.quizTitleContainer}>
                  <h1 className={sidebarStyles.quizTitle}>
                    {technologies.find((t) => t.id === selectedTech).name} -{" "}
                    {selectedLevel.charAt(0).toUpperCase() +
                      selectedLevel.slice(1)}{" "}
                    Level
                  </h1>
                  <span className={sidebarStyles.quizCounter}>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>

                <div className={sidebarStyles.progressBar}>
                  <div
                    className={sidebarStyles.progressFill}
                    style={{
                      width: `${
                        ((currentQuestion + 1) / (questions.length || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className={sidebarStyles.questionContainer}>
                <div className={sidebarStyles.questionHeader}>
                  <div className={sidebarStyles.questionIcon}>
                    <BiTargetLock size={20} />
                  </div>
                  <h2 className={sidebarStyles.questionText}>
                    {currentQ.question}
                  </h2>
                </div>

                <div className={sidebarStyles.optionsContainer}>
                  {currentQ.options.map((option, index) => {
                    const isSelected = userAnswers[currentQuestion] === index;
                    const isCorrect = index === currentQ.correctAnswer;
                    const showFeedback =
                      userAnswers[currentQuestion] !== undefined;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSubmit(index)}
                        disabled={userAnswers[currentQuestion] !== undefined}
                        className={`${sidebarStyles.optionButton} ${
                          isSelected
                            ? isCorrect
                              ? sidebarStyles.optionCorrect
                              : sidebarStyles.optionIncorrect
                            : showFeedback && isCorrect
                            ? sidebarStyles.optionCorrect
                            : sidebarStyles.optionNormal
                        }`}
                      >
                        <div className={sidebarStyles.optionContent}>
                          {showFeedback ? (
                            isSelected ? (
                              isCorrect ? (
                                <BiCheckCircle
                                  size={20}
                                  className={sidebarStyles.optionIconCorrect}
                                />
                              ) : (
                                <BiXCircle
                                  size={20}
                                  className={sidebarStyles.optionIconIncorrect}
                                />
                              )
                            ) : isCorrect ? (
                              <BiCheckCircle
                                size={20}
                                className={sidebarStyles.optionIconCorrect}
                              />
                            ) : (
                              <div className={sidebarStyles.optionIconEmpty} />
                            )
                          ) : (
                            <div className={sidebarStyles.optionIconEmpty} />
                          )}
                          <span className={sidebarStyles.optionText}>
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={sidebarStyles.loadingContainer}>
              <div className={sidebarStyles.loadingContent}>
                <div className={sidebarStyles.loadingSpinner} />
                <h3 className={sidebarStyles.loadingTitle}>
                  Preparing Your Quiz
                </h3>
                <p className={sidebarStyles.loadingDescription}>
                  Loading questions...
                </p>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default SideBar;
