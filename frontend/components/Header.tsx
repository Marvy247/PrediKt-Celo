"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { PiggyBank, Users, Lock, CreditCard, Menu, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative p-2 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <PiggyBank className="h-6 w-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-800 transition-all duration-300">
                PiggySavfe
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                Decentralized Savings
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 group"
            >
              <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/thrift"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Thrift</span>
            </Link>
            <Link
              href="/piggy"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group"
            >
              <Lock className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Piggy Box</span>
            </Link>
            <Link
              href="/pay"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group"
            >
              <CreditCard className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Pay Bills</span>
            </Link>
          </nav>

          {/* Wallet Connect & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <div className="block">
              <ConnectButton />
            </div>

            {/* Mobile Menu Button - Hidden on very small screens */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/thrift"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Thrift Savings</span>
              </Link>
              <Link
                href="/piggy"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lock className="h-5 w-5" />
                <span className="font-medium">Piggy Box</span>
              </Link>
              <Link
                href="/pay"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Pay Bills</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
