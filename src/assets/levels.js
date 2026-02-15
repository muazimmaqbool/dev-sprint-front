import { FaRegStar } from "react-icons/fa";
import { FiTarget, FiZap } from "react-icons/fi";

export   const levels = [
    {
      id: "basic",
      name: "Basic",
      questions: 20,
      icon: <FaRegStar size={16} />,
      color: "bg-green-50 text-green-600",
    },
    {
      id: "intermediate",
      name: "Intermediate",
      questions: 40,
      icon: <FiZap size={16} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "advanced",
      name: "Advanced",
      questions: 60,
      icon: <FiTarget size={16} />,
      color: "bg-purple-50 text-purple-600",
    },
  ];