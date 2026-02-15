import { BiLogoCPlusPlus } from "react-icons/bi";
import { BsFiletypeCss } from "react-icons/bs";
import { DiMongodb } from "react-icons/di";
import {
  FaBootstrap,
  FaHtml5,
  FaJava,
  FaJs,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";

export const technologies = [
  {
    id: "html",
    name: "HTML",
    icon: <FaHtml5 size={20} />,
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    id: "css",
    name: "CSS",
    icon: <BsFiletypeCss size={20} />,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: "js",
    name: "JavaScript",
    icon: <FaJs size={20} />,
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
  },
  {
    id: "react",
    name: "React",
    icon: <FaReact size={20} />,
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
  },
  {
    id: "node",
    name: "Node.js",
    icon: <FaNodeJs size={20} />,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: <DiMongodb size={20} />,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    id: "java",
    name: "Java",
    icon: <FaJava size={20} />,
    color: "bg-red-50 text-red-600 border-red-200",
  },
  {
    id: "python",
    name: "Python",
    icon: <FaPython size={20} />,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
  {
    id: "cpp",
    name: "C++",
    icon: <BiLogoCPlusPlus size={20} />,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    icon: <FaBootstrap size={20} />,
    color: "bg-pink-50 text-pink-600 border-pink-200",
  },
];
