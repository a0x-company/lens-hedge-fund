import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const LENS_API = 'https://api-v2.lens.dev'

export async function POST(request: NextRequest) {
  try {
    const { id, signature } = await request.json()
    const accessToken = cookies().get('lens.accessToken')

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const response = await fetch(LENS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`
      },
      body: JSON.stringify({
        query: `
          mutation broadcastOnchain($request: BroadcastRequest!) {
            broadcastOnchain(request: $request) {
              ... on RelaySuccess {
                txHash
                txId
              }
              ... on RelayError {
                reason
              }
            }
          }
        `,
        variables: {
          request: {
            id,
            signature
          }
        }
      })
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    const result = data.data.broadcastOnchain

    if ('reason' in result) {
      return NextResponse.json({ error: result.reason }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error broadcasting:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Broadcast failed' },
      { status: 500 }
    )
  }
}