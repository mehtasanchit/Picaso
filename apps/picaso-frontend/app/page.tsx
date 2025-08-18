"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Palette,
  Users,
  Download,
  Zap,
  Eye,
  Layers,
  ArrowRight,
  Github,
  Twitter,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-md shadow-xl border-b border-gray-800"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Picaso
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                How it works
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <div className="flex items-center space-x-3">
                <Link href={"/signin"}>
                  <button className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </button>
                </Link>
                <Link href={"/signup"}>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  className="block px-3 py-2 text-gray-300 hover:text-blue-400 rounded-lg hover:bg-gray-700"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 text-gray-300 hover:text-blue-400 rounded-lg hover:bg-gray-700"
                >
                  How it works
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-gray-300 hover:text-blue-400 rounded-lg hover:bg-gray-700"
                >
                  About
                </a>
                <div className="pt-4 space-y-2">
                  <Link href={token ? "/signin" : "/signup"}>
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700 flex items-center">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </button>
                  </Link>
                  <Link href={"/signin"}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Draw Ideas,
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                Share Visions
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Picaso is a virtual collaborative whiteboard that lets you easily
              sketch diagrams that have a hand-drawn feel to them. Perfect for
              brainstorming, wireframing, and visual thinking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={token ? "/signin" : "/signup"}>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center group">
                  Start Drawing Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href={"https://github.com/mehtasanchit"}>
                <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-400 hover:bg-gray-800 transition-all duration-300 flex items-center">
                  <Github className="mr-2 w-5 h-5" />
                  View on GitHub
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Everything you need to visualize ideas
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to make collaboration and creativity
              effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Hand-drawn Feel",
                description:
                  "Sketchy, hand-drawn style that makes diagrams feel more personal and engaging",
                color: "bg-blue-500",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Real-time Collaboration",
                description:
                  "Work together with your team in real-time. See cursors, edits, and changes instantly",
                color: "bg-purple-500",
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "Export Anywhere",
                description:
                  "Export to PNG, SVG, or clipboard. Your work, your way, wherever you need it",
                color: "bg-orange-500",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description:
                  "Optimized for performance. No lag, no delays, just smooth creative flow",
                color: "bg-green-500",
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: "Infinite Canvas",
                description:
                  "Never run out of space. Pan and zoom across an infinite canvas of possibilities",
                color: "bg-indigo-500",
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Privacy First",
                description:
                  "Your data stays yours. No tracking, no ads, no compromises on your privacy",
                color: "bg-pink-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-black/25 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 group"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Simple, powerful, intuitive
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started in seconds, master in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Start Drawing",
                description:
                  "Open Picaso and start sketching immediately. No sign-ups, no downloads, no hassles.",
              },
              {
                step: "02",
                title: "Invite & Collaborate",
                description:
                  "Share your canvas link with teammates. Watch as ideas come to life together in real-time.",
              },
              {
                step: "03",
                title: "Export & Share",
                description:
                  "Save your work as PNG, SVG, or share the live canvas. Your creativity, delivered anywhere.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transform -translate-x-1/2"></div>
                )}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/25">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to bring your ideas to life?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of creators, designers, and teams who trust Picaso
            for their visual collaboration needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center group">
                <UserPlus className="mr-2 w-5 h-5" />
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <a
              href="https://x.com/Sanchit37239672"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center">
                <Twitter className="mr-2 w-5 h-5" />
                Follow Updates
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Picaso</span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/mehtasanchit"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/Sanchit37239672"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Picaso. Made with ❤️ for creative minds everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
