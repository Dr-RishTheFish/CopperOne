import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-blue-700 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo and Brand Section */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-red-600 flex items-center justify-center">
            <PiggyBank className="w-12 h-12 text-red-600" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">Copper One</h1>
        <p className="text-xl text-white">Learn, Save, Grow</p>
      </div>
      

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Log In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-4 rounded-lg mb-4 hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mb-6">
          <button className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors">
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-white text-base">
          Don't have an account?{' '}
          <button
            onClick={handleSignUp}
            className="text-blue-300 underline font-medium hover:text-blue-200 transition-colors"
          >
            Ask a parent to sign up
          </button>
        </p>
      </div>

      {/* Meet the Developers Link */}
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            // TODO: Replace with actual developer link
            // window.open('YOUR_DEVELOPER_LINK_HERE', '_blank');
            alert('Developer link will be added soon!');
          }}
          className="text-blue-300 text-sm underline hover:text-blue-200 transition-colors bg-transparent border-none cursor-pointer"
        >
          Meet the Developers
        </button>
      </div>

      {/* Attribution */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
          <span className="text-white text-sm font-medium">Powered by</span>
          <span className="text-white text-sm font-bold">Capital One</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
