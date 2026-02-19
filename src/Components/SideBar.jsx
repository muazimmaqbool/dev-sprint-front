import React, { useEffect, useRef, useState } from "react";
import { sidebarStyles } from "../assets/dummyStyle";
import questionsData from "../assets/questions";
import { toast } from "react-toastify";
import axios from "axios";
import { FiBookOpen } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { technologies } from "../assets/technologies";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

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
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SideBar;
