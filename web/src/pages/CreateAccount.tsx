import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, ArrowLeft, Shield, User, Calendar, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FormData {
  accountType: 'parent' | 'kid' | '';
  childName: string;
  childAge: string;
  parentName: string;
  parentEmail: string;
  parentPIN: string;
  confirmPIN: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [signUpStep, setSignUpStep] = useState<number>(1);
  const [accountType, setAccountType] = useState<'parent' | 'kid' | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    accountType: '',
    childName: '',
    childAge: '',
    parentName: '',
    parentEmail: '',
    parentPIN: '',
    confirmPIN: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (signUpStep === 1) {
      if (accountType) {
        setFormData((prev) => ({ ...prev, accountType }));
        setSignUpStep(2);
      }
    } else if (signUpStep === 2) {
      // Validate Step 2 fields
      if (
        formData.childName &&
        formData.childAge &&
        formData.parentName &&
        formData.parentEmail &&
        formData.parentPIN &&
        formData.confirmPIN &&
        formData.parentPIN === formData.confirmPIN
      ) {
        setSignUpStep(3);
      }
    }
  };

  const handleBack = () => {
    if (signUpStep > 1) {
      setSignUpStep(signUpStep - 1);
      setError('');
    } else {
      navigate('/login');
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate PINs match
    if (formData.parentPIN !== formData.confirmPIN) {
      setError('PINs do not match');
      return;
    }

    if (
      formData.username &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    ) {
      setLoading(true);
      try {
        const success = await signup(formData);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Failed to create account. Please try again.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const progressPercentage = (signUpStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C8102E] via-[#A01028] to-[#5E3BA6] flex flex-col items-center justify-center px-4 py-8">
      {/* Logo and Brand Section */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-[#C8102E] flex items-center justify-center">
            <PiggyBank className="w-12 h-12 text-[#C8102E]" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">Copper One</h1>
        <p className="text-xl text-white">Learn, Save, Grow</p>
      </div>

      {/* Create Account Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        {/* Back to Login Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Login</span>
        </button>

        {/* Title and Step Indicator */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-sm text-gray-600 mb-4">Step {signUpStep} of 3</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-[#C8102E] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step 1: Account Type Selection */}
        {signUpStep === 1 && (
          <div>
            <p className="text-gray-700 font-medium mb-4">Who's setting up this account?</p>
            
            {/* Parent/Guardian Option */}
            <button
              onClick={() => setAccountType('parent')}
              className={`w-full mb-4 p-4 border-2 rounded-lg text-left transition-all ${
                accountType === 'parent'
                  ? 'border-[#C8102E] bg-red-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={accountType === 'parent'}
                  onChange={() => setAccountType('parent')}
                  className="mt-1"
                />
                <Shield className="w-5 h-5 text-[#C8102E] mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Parent/Guardian</p>
                  <p className="text-sm text-gray-600">Set up account for my child</p>
                </div>
              </div>
            </button>

            {/* Kid Option */}
            <button
              onClick={() => setAccountType('kid')}
              className={`w-full mb-6 p-4 border-2 rounded-lg text-left transition-all ${
                accountType === 'kid'
                  ? 'border-[#C8102E] bg-red-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={accountType === 'kid'}
                  onChange={() => setAccountType('kid')}
                  className="mt-1"
                />
                <User className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Kid (with parent's help)</p>
                  <p className="text-sm text-gray-600">Parent is helping me sign up</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleContinue}
              disabled={!accountType}
              className="w-full bg-[#C8102E] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#A01028] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Child & Parent Info */}
        {signUpStep === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
            <div className="space-y-4">
              {/* Child's Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Child's Name
                </label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) => handleInputChange('childName', e.target.value)}
                  placeholder="Enter child's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>

              {/* Child's Age */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Child's Age
                </label>
                <input
                  type="text"
                  value={formData.childAge}
                  onChange={(e) => handleInputChange('childAge', e.target.value)}
                  placeholder="Age (6-17)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>

              {/* Parent/Guardian Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4" />
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  placeholder="Enter parent's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>

              {/* Parent's Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Parent's Email
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>

              {/* Create Parent PIN */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Create Parent PIN
                </label>
                <input
                  type="password"
                  value={formData.parentPIN}
                  onChange={(e) => handleInputChange('parentPIN', e.target.value)}
                  placeholder="Enter a 4-6 digit PIN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This PIN will be required to access parent controls
                </p>
              </div>

              {/* Confirm Parent PIN */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Confirm Parent PIN
                </label>
                <input
                  type="password"
                  value={formData.confirmPIN}
                  onChange={(e) => handleInputChange('confirmPIN', e.target.value)}
                  placeholder="Re-enter PIN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C8102E] text-white font-bold py-3 px-4 rounded-lg mt-6 mb-3 hover:bg-[#A01028] transition-colors"
            >
              Continue
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full bg-white text-[#C8102E] font-bold py-3 px-4 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </form>
        )}

        {/* Step 3: Account Credentials */}
        {signUpStep === 3 && (
          <form onSubmit={handleCreateAccount}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              {/* Create Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Create Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>

              {/* Create Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Create Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                  required
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Parent controls will be set up to help manage spending limits and monitor activity!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8102E] text-white font-bold py-3 px-4 rounded-lg mt-6 mb-3 hover:bg-[#A01028] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full bg-white text-gray-700 font-bold py-3 px-4 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </form>
        )}
      </div>

      {/* Footer Attribution */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
          <span className="text-white text-sm font-medium">Powered by</span>
          <span className="text-white text-sm font-bold">Capital One</span>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;

