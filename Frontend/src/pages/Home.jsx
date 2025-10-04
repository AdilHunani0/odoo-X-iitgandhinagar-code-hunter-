import React, { useState, useEffect } from 'react';
import { Menu, X, Check, ArrowRight, Zap, Users, Shield, Clock } from 'lucide-react';

export default function ExpenseFlowLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🔄',
      title: 'Multi-Level Approvals',
      description: 'Define sequential approval workflows with custom rules and thresholds',
      details: 'Create complex approval chains from Manager → Finance → Director with conditional logic'
    },
    {
      icon: '📸',
      title: 'OCR Receipt Scanning',
      description: 'Just snap a photo - AI extracts all expense details automatically',
      details: 'Advanced OCR technology reads amount, date, merchant, and line items from receipts'
    },
    {
      icon: '🌍',
      title: 'Multi-Currency Support',
      description: 'Handle expenses in any currency with real-time conversion',
      details: 'Automatic currency conversion using live exchange rates for 180+ countries'
    },
    {
      icon: '⚡',
      title: 'Smart Rules Engine',
      description: 'Percentage-based or specific approver rules - you choose',
      details: 'Set up approval rules like "60% approval" or "CFO auto-approve" with flexible logic'
    }
  ];

  const benefits = [
    { icon: <Zap className="w-6 h-6" />, title: 'Lightning Fast', desc: 'Process expenses in seconds, not days' },
    { icon: <Users className="w-6 h-6" />, title: 'Team Collaboration', desc: 'Seamless communication between all stakeholders' },
    { icon: <Shield className="w-6 h-6" />, title: 'Secure & Compliant', desc: 'Bank-level security with audit trails' },
    { icon: <Clock className="w-6 h-6" />, title: 'Real-time Tracking', desc: 'Know the status of every expense instantly' }
  ];

  const howItWorks = [
    { step: '01', title: 'Submit Expense', desc: 'Employee scans receipt or manually enters expense details with OCR support' },
    { step: '02', title: 'Auto-Route', desc: 'System automatically routes to appropriate approvers based on rules and thresholds' },
    { step: '03', title: 'Review & Approve', desc: 'Managers review, approve/reject with comments in their dashboard' },
    { step: '04', title: 'Get Reimbursed', desc: 'Approved expenses are processed for payment with full transparency' }
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '29',
      users: 'Up to 10 users',
      features: ['Basic approval workflows', 'OCR receipt scanning', 'Multi-currency support', 'Email notifications', 'Mobile app access']
    },
    {
      name: 'Business',
      price: '79',
      users: 'Up to 50 users',
      features: ['Advanced approval rules', 'Custom workflows', 'Priority support', 'API access', 'Advanced analytics', 'Integrations'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      users: 'Unlimited users',
      features: ['Everything in Business', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'White-label options', 'On-premise deployment']
    }
  ];

  // Vite/React Router navigation for SPA
  const handleLogin = () => window.location.href = '/login';
  const handleSignup = () => window.location.href = '/signup';

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full px-6 md:px-12 py-5 flex justify-between items-center z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white bg-opacity-90 backdrop-blur-md'}`}>
        <div className="flex items-center gap-3 font-bold text-2xl text-indigo-600">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">💸</div>
          <span>ExpenseFlow</span>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
              className="font-medium text-gray-700 transition-all hover:text-indigo-600 hover:-translate-y-0.5 relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={handleLogin}
            className="font-semibold px-6 py-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            Login
          </button>
          <button 
            onClick={handleSignup}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            Sign Up Free
          </button>
        </div>
        {/* Mobile Nav Button */}
        <button className="md:hidden text-indigo-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6">
          <div className="flex flex-col gap-6">
            {['Features', 'How it Works', 'Pricing', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-xl font-medium text-gray-700">{item}</a>
            ))}
            <button onClick={handleLogin} className="text-xl font-medium text-indigo-600 text-left">Login</button>
            <button onClick={handleSignup} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold mt-4">Sign Up Free</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 pt-32 pb-12 relative overflow-hidden">
        {/* Animated backgrounds */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-72 h-72 bg-indigo-200 opacity-30 rounded-full top-[10%] left-[10%] animate-float blur-3xl"></div>
          <div className="absolute w-48 h-48 bg-purple-200 opacity-30 rounded-full bottom-[20%] right-[15%] animate-float-delayed blur-3xl"></div>
          <div className="absolute w-36 h-36 bg-blue-200 opacity-30 rounded-full top-[60%] left-[80%] animate-float-slow blur-3xl"></div>
        </div>
        <div className="max-w-6xl text-center z-10">
          <div className="inline-block bg-indigo-100 px-6 py-2 rounded-full mb-6 border border-indigo-200">
            <span className="text-indigo-700 font-medium">🎉 Now with AI-Powered OCR</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fadeInUp leading-tight">
            Smart Expense Management, Simplified
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-700 animate-fadeInUp max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
            Automate approvals, scan receipts with OCR, and manage expenses across multiple currencies with intelligent workflows. Say goodbye to manual expense reports.
          </p>
          <div className="flex flex-col md:flex-row gap-5 justify-center mb-16 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={handleSignup}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-semibold border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-1 transition-all text-lg">
              Watch Demo
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-16">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-lg text-gray-700">Time Saved</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-lg text-gray-700">Transparency</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">0</div>
              <div className="text-lg text-gray-700">Manual Errors</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-3xl text-indigo-400 animate-bounce">
          ↓
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">Powerful Features</h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Everything you need to streamline your expense management process
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 transition-all cursor-pointer ${hoveredCard === index ? 'transform -translate-y-2 shadow-xl' : 'shadow-md'}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-3">{feature.description}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.details}</p>
              </div>
            ))}
          </div>
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl text-center shadow-md border border-indigo-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {benefit.icon}
                </div>
                <h4 className="font-bold mb-2 text-gray-900">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">How It Works</h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Four simple steps to transform your expense management
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-indigo-200 mb-4">{item.step}</div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-20 -right-4 text-3xl text-indigo-300">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">Simple, Transparent Pricing</h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Choose the plan that fits your team size and needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, idx) => (
              <div 
                key={idx}
                className={`bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2
                  ${plan.popular ? 'border-indigo-500 transform scale-105 shadow-2xl' : 'border-indigo-100 shadow-lg'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <div className="mb-4 text-gray-900">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.users}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleSignup}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                      : 'bg-white text-indigo-600 border-2 border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white opacity-95">
            Join thousands of companies already streamlining their expense management
          </p>
          <button 
            onClick={handleSignup}
            className="bg-white text-indigo-600 px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4 text-indigo-600">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">💸</div>
              ExpenseFlow
            </div>
            <p className="text-gray-600 text-sm">Smart expense management for modern teams</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#features" className="hover:text-indigo-600">Features</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-600">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-indigo-600">About</a></li>
              <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
              <li><a href="#contact" className="hover:text-indigo-600">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
              <li><a href="#" className="hover:text-indigo-600">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2025 ExpenseFlow. All rights reserved.
        </div>
      </footer>
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-float-delayed { animation: float 20s infinite ease-in-out 5s; }
        .animate-float-slow { animation: float 20s infinite ease-in-out 10s; }
        .animate-fadeInUp { animation: fadeInUp 1s ease both; }
      `}</style>
    </div>
  );
}
