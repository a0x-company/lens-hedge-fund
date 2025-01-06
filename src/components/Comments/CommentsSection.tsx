'use client'

import { useLensAuth } from '@/hooks/useLensAuth'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

export function CommentsSection() {
  const { open } = useAppKit()
  const { isConnected } = useAccount()
  const { authenticate, profile, loading } = useLensAuth()

  const handleConnect = async () => {
    if (!isConnected) {
      open()
    } else if (!profile) {
      await authenticate()
    }
  }

  return (
    <section className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        
        {loading ? (
          <button disabled className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
            Loading...
          </button>
        ) : profile ? (
          <div className="flex items-center gap-2">
            {profile.picture && (
              <img 
                src={profile.picture} 
                alt={profile.handle} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">{profile.handle}</span>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            className="bg-brand-green-light text-black px-4 py-2 rounded-lg hover:bg-brand-green-light/80 transition-all shadow-md hover:shadow-lg"
          >
            {isConnected ? 'Connect Lens' : 'Connect Wallet'}
          </button>
        )}
      </div>

      {profile && (
        <div className="mt-4">
          {/* Aquí irá el formulario de comentarios */}
        </div>
      )}
    </section>
  )
}