'use client'

import { useState } from 'react'
import { useLensAuth } from '@/hooks/useLensAuth'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useToast } from '@/components/shadcn/use-toast'
import { Textarea } from '@/components/shadcn/textarea'
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-react'

interface CommentsSectionProps {
  tokenAddress: string
}

export function CommentsSection({ tokenAddress }: CommentsSectionProps) {
  const { open } = useAppKit()
  const { isConnected } = useAccount()
  const { authenticate, profile, loading: authLoading } = useLensAuth()
  const { toast } = useToast()
  
  const [comment, setComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [comments, setComments] = useState<any[]>([]) // TODO: Tipado correcto
  const [loadingComments, setLoadingComments] = useState(false)

  const handleConnect = async () => {
    try {
      if (!isConnected) {
        open()
      } else if (!profile) {
        await authenticate()
      }
    } catch (error) {
      console.error('Error connecting:', error)
      toast({
        title: "Error",
        description: "Failed to connect. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !profile || isPosting) return

    try {
      setIsPosting(true)
      const response = await fetch('/api/lens/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment.trim(),
          tokenAddress
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment')
      }

      toast({
        title: "Success",
        description: "Comment posted successfully!"
      })

      setComment('')
      // TODO: Actualizar lista de comentarios
      // await loadComments()

    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment",
        variant: "destructive"
      })
    } finally {
      setIsPosting(false)
    }
  }

  // TODO: Implementar carga de comentarios
  /*
  const loadComments = async () => {
    try {
      setLoadingComments(true)
      const response = await fetch(`/api/lens/comments/${tokenAddress}`)
      const data = await response.json()
      setComments(data.comments)
    } catch (error) {
      console.error('Error loading comments:', error)
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      })
    } finally {
      setLoadingComments(false)
    }
  }
  */

  return (
    <section className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Comments</h3>
        
        {authLoading ? (
          <Button disabled variant="outline" size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
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
          <Button 
            onClick={handleConnect}
            variant="default"
            size="sm"
          >
            {isConnected ? 'Connect Lens' : 'Connect Wallet'}
          </Button>
        )}
      </div>

      {/* Comment Form */}
      {profile && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="min-h-[100px]"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isPosting || !comment.trim()}
          >
            {isPosting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </Button>
        </form>
      )}

      {/* Comments List */}
      <div className="mt-8 space-y-4">
        {loadingComments ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="p-4 border rounded-lg"
            >
              {/* TODO: Implementar vista de comentario */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </section>
  )
}