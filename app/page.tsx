'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useChatStore } from '@/lib/store'
import { AuthPage } from '@/components/auth-page'
import { ChatPage } from '@/components/chat-page'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { user, setUser } = useChatStore()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        console.log("Auth user:", authUser)
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || "",
          })
        }
      } catch (error) {
        console.error("Error checking user:", error)
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email)
        if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, setUser])

  if (!mounted) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return user ? <ChatPage /> : <AuthPage />
}