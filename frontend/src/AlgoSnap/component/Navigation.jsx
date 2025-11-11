
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaGithub, FaListUl, FaMoon, FaSun } from "react-icons/fa";
import { BiBracket } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/Theme";

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-base-100 text-base-content font-semibold shadow-lg font-[Poppins] z-50">
      <div className="container mx-auto px-3 sm:px-6 py-4 flex justify-between items-center">
        {/* Render appropriate navigation based on screen size */}
        {isMobile ? (
          <MobileNavigation isOpen={menuOpen} toggleMenu={toggleMenu} onThemeToggle={handleThemeToggle} theme={theme} />
        ) : (
          <DesktopNavigation onThemeToggle={handleThemeToggle} theme={theme} />
        )}
      </div>
    </nav>
  );
}

// Desktop Navigation Component
function DesktopNavigation({ onThemeToggle, theme }) {
  const navLinks = [
    { to: "/AI", text: "APNA AI" },
    { to: "/", text: "HOME" },
    {
      to: "/array-linkedlist",
      text: "Array & Linkedlist",
    },
    { to: "/searching-sorting", text: "SEARCHING & SORTING" },
    { to: "/tree-graph", text: "TREE & GRAPH" },
    {
      to: "https://github.com/2005Ashwani",
      text: <FaGithub />,
      external: true,
    },
  ];

  return (
    <>
      {/* Logo */}
      <div className="text-3xl font-extrabold tracking-wider text-primary animate-pulse">
        ALGO SNAP
      </div>
      <div className="flex items-center space-x-6">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            target={link.external ? "_blank" : "_self"}
            className="flex items-center px-3 py-2 rounded-full hover:text-primary
                     hover:scale-105 hover:shadow-md transition-all duration-300
                     group relative"
          >
            <span className="flex items-center gap-2">
              <span>{link.text}</span>
              {link.icon && (
                <span className="group-hover:rotate-12 transition-transform">
                  {link.icon}
                </span>
              )}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary
                          scale-x-0 group-hover:scale-x-100 transition-transform
                          origin-left duration-300"></span>
          </Link>
        ))}
        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
        </button>
      </div>
    </>
  );
}

// Mobile Navigation Component
function MobileNavigation({ isOpen, toggleMenu, onThemeToggle, theme }) {
  const navLinks = [
    { to: "/AI", text: "APNA AI", icon: "🤖" },
    { to: "/", text: "HOME", icon: "🏠" },
    {
      to: "/array-linkedlist",
      text: "Array & Linkedlist",
      icon: (
        <span className="flex items-center gap-1">
          <BiBracket className="text-blue-400 text-xl" />
          <FaListUl className="text-green-400 text-xl" />
        </span>
      ),
    },
    { to: "/searching-sorting", text: "SEARCHING & SORTING", icon: "🔍" },
    { to: "/tree-graph", text: "TREE & GRAPH", icon: "🌳" },
    {
      to: "https://github.com/2005Ashwani",
      text: "GIT&GITHUB",
      icon: <FaGithub className="text-xl" />,
      external: true,
    },
  ];

  return (
    <>
      {/* Hamburger Button and Theme Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onThemeToggle}
          className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
        </button>
        <button
          className="text-2xl focus:outline-none z-50 text-base-content"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-base-100
                   flex flex-col items-center justify-center space-y-8 transition-all
                   duration-500 ease-in-out transform ${
                     isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                   } z-40`}
      >
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            target={link.external ? "_blank" : "_self"}
            onClick={toggleMenu}
            className="text-3xl font-light px-8 py-4 rounded-xl w-full max-w-xs
                      text-center flex items-center justify-center gap-4 text-base-content
                      hover:bg-base-200 hover:scale-105 transition-all duration-300
                      relative overflow-hidden group"
          >
            <span className="absolute left-0 top-0 w-1 h-full bg-primary
                             transform -translate-x-full group-hover:translate-x-0
                             transition-transform duration-300"></span>
            <span className="text-2xl">{link.icon}</span>
            <span>{link.text}</span>
            <span className="absolute right-0 bottom-0 w-full h-0.5 bg-primary
                             transform scale-x-0 group-hover:scale-x-100
                             transition-transform duration-300 origin-left"></span>
          </Link>
        ))}
      </div>
    </>
  );
}
