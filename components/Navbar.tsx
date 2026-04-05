'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-lg hover:text-emerald-400 transition-colors"
          >
            <span className="text-2xl">⚡</span>
            <span>Polymarket Signals</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#features"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all duration-150"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all duration-150"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all duration-150"
            >
              Dashboard
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-md hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-all duration-150 font-medium"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 text-sm text-white bg-emerald-500 hover:bg-emerald-600 rounded-md border border-emerald-500 hover:border-emerald-600 shadow-lg shadow-emerald-500/20 transition-all duration-150 font-medium"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 py-3 space-y-1">
            <Link
              href="/#features"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <div className="pt-2 flex flex-col gap-2 px-4">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all font-medium"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
