'use client'

import { useState, useCallback } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useToast } from '@/components/shadcn/use-toast'

interface Profile {
  id: string
  handle: string
  picture?: string
  displayName?: string
  stats?: {
    followers: number
    following: number
    posts: number
  }
}

export function useLensAuth() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const authenticate = useCallback(async () => {
    if (!address) return

    try {
      setLoading(true)
      
      // 1. Obtener el challenge
      const challengeRes = await fetch('/api/lens/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      
      const { text, id } = await challengeRes.json()
      
      // 2. Firmar el mensaje
      const signature = await signMessageAsync({ message: text })
      
      // 3. Verificar y autenticar
      const authRes = await fetch('/api/lens/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, signature, address })
      })

      const data = await authRes.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.needsSignless) {
        // Manejar la activación de signless si es necesario
        // Esto es opcional y puedes implementarlo más tarde
      }

      setProfile(data.profile)
      toast({
        title: "Connected to Lens",
        description: `Welcome ${data.profile.handle}!`
      })

      return data.profile

    } catch (error) {
      console.error('Error authenticating with Lens:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect to Lens",
        variant: "destructive"
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [address, signMessageAsync, toast])

  return {
    authenticate,
    profile,
    loading
  }
}