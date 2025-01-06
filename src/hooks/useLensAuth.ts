import { useAccount, useSignMessage } from 'wagmi'
import { useState, useCallback } from 'react'

interface Profile {
  id: string
  handle: string
  displayName?: string
  picture?: string
  stats: {
    followers: number
    following: number
    posts: number
  }
}

export function useLensAuth() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  const authenticate = useCallback(async () => {
    if (!address || !isConnected) return

    try {
      setLoading(true)
      
      // 1. Obtener el challenge
      const challengeRes = await fetch('/api/lens/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      
      const { id, text, profile: challengeProfile } = await challengeRes.json()
      
      // 2. Firmar el challenge
      const signature = await signMessageAsync({ message: text })
      
      // 3. Verificar la firma y autenticar
      const authRes = await fetch('/api/lens/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          signature,
          address 
        })
      })

      const { success, profile: authProfile, needsSignless, signlessData } = await authRes.json()

      if (needsSignless) {
        // 4. Si es necesario, habilitar signless
        const { typedData } = signlessData
        const signlessSignature = await signMessageAsync({ 
          message: JSON.stringify(typedData)
        })

        await fetch('/api/lens/authenticate', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: signlessData.id,
            signature: signlessSignature
          })
        })
      }

      setProfile(authProfile)
      return authProfile

    } catch (error) {
      console.error('Error authenticating with Lens:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [address, isConnected, signMessageAsync])

  return {
    authenticate,
    profile,
    loading,
    isConnected
  }
}