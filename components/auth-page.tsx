
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useChatStore } from '@/lib/store'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState("")
  const setUser = useChatStore((state) => state.setUser)
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess("")

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}` },
        })
        if (signUpError) throw signUpError
        setSuccess('Check your email to confirm your account!')
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' })
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="w-full max-w-md p-5 bg-[#111827]/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-8 text-center text-white tracking-wide">
          Chat AI
        </h1> 

        <form onSubmit={handleAuth}>
          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-xl font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg 
                         bg-gray-800 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-xl font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg 
                         bg-gray-800 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="p-3 bg-red-900/60 text-red-200 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-900/60 text-green-200 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold 
                       hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-5 text-sm text-blue-400 hover:text-blue-300 transition"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don’t have an account? Sign Up"}
        </button>
      </div>
    </div>
  )
}
