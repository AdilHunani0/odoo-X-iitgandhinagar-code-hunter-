import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/login", label: "Login" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
    { to: "/page-4", label: "page-4" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div>
              <Link
                to="/"
                className="text-2xl font-bold text-gray-800 hover:text-blue-600"
              >
                Logo
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button (optional) */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-blue-600 p-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content being hidden behind navbar */}
      <div className="h-16"></div>
    </>
  );
}
