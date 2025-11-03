import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { DEMO_MODE, DEMO_USERS, generateDemoToken } from "../config/demoMode";
import { delay } from "../config/mockData";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      let data;
      
      // Check if demo mode is enabled
      if (DEMO_MODE) {
        // Use demo login
        await delay(800); // Simulate network delay
        const user = DEMO_USERS.find(u => u.email === formData.email && u.password === formData.password);
        
        if (!user) {
          throw new Error("Invalid email or password");
        }
        
        const token = generateDemoToken(user.id);
        data = {
          user: {
            ...user,
            restaurant: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0
          },
          token
        };
      } else {
        // Use real backend
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed. Please check your credentials.");
        }
      }

      // Store token and user data using AuthContext
      login(data.user, data.token);

      // Redirect based on role or intended destination
      const roleRedirects = {
        Owner: "/dashboard",
        Manager: "/dashboard",
        Chef: "/kitchenstaff",
        Waiter: "/waiter",
      };
      
      const redirectPath = roleRedirects[data.user.role] || from;
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>
        
        {/* Demo Mode Banner */}
        {DEMO_MODE && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-[#123499] mb-2">🎭 Demo Mode Active</p>
            <p className="text-xs text-gray-600">Try these credentials:</p>
            <div className="mt-2 space-y-1">
              {DEMO_USERS.map((user, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: user.email,
                      password: user.password,
                      remember: false
                    });
                  }}
                  className="block w-full text-left text-xs text-gray-700 hover:text-[#123499] transition-colors"
                >
                  {user.role}: {user.email}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123499] focus:border-transparent"
                placeholder="your@email.com"
                required
                autoComplete="username" // Add this
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123499] focus:border-transparent"
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 text-[#123499] focus:ring-[#123499] border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-700">Remember me</label>
            </div>
            <button
              type="button"
              className="text-[#123499] hover:text-[#0f2a7a] text-sm font-medium"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[#123499] hover:bg-[#0f2a7a] text-white py-3 px-4 rounded-lg font-semibold shadow-md transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          {loginError && (
            <p className="text-red-500 text-center">{loginError}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
