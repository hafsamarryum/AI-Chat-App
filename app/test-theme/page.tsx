"use client";

import { useTheme } from "@/app/context/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function TestThemePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Theme Test Page
          </h1>
          <button
            onClick={toggleTheme}
            className="p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={24} className="text-yellow-400" />
            ) : (
              <Moon size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Current Theme Info */}
        <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-xl text-blue-900 dark:text-blue-100">
            Current Theme: <strong>{theme}</strong>
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
            HTML class:{" "}
            <strong>
              {typeof window !== "undefined"
                ? document.documentElement.className
                : "N/A"}
            </strong>
          </p>
        </div>

        {/* Color Tests */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Color Tests
          </h2>

          {/* Gray Scale */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-900 dark:text-white font-semibold mb-2">
              Gray Scale Test
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                Gray 100/700
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded">
                Gray 200/600
              </div>
              <div className="p-3 bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-white rounded">
                Gray 300/500
              </div>
            </div>
          </div>

          {/* Blue Scale */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
              Blue Scale Test
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded">
                Blue 100/800
              </div>
              <div className="p-3 bg-blue-500 text-white rounded">
                Blue 500 (same in both modes)
              </div>
            </div>
          </div>

          {/* Text Colors */}
          <div className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-900 dark:text-white font-semibold mb-2">
              Text Color Test
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              This is gray-700 in light mode, gray-300 in dark mode
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              This is gray-500 in light mode, gray-400 in dark mode
            </p>
          </div>

          {/* Border Test */}
          <div className="p-4 border-4 border-gray-900 dark:border-white rounded-lg bg-white dark:bg-gray-900">
            <p className="text-gray-900 dark:text-white font-semibold">
              Border Test: Black border in light mode, white in dark mode
            </p>
          </div>

          {/* Gradient Test */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
            <p className="text-gray-900 dark:text-white font-semibold">
              Gradient Background Test
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
            Instructions
          </h3>
          <ul className="list-disc list-inside text-yellow-800 dark:text-yellow-200 space-y-1">
            <li>Click the sun/moon button to toggle theme</li>
            <li>All colors should change smoothly</li>
            <li>Check if the HTML class shows dark when in dark mode</li>
            <li>Verify localStorage is being set correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
