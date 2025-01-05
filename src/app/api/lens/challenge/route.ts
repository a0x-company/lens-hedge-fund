import { NextRequest, NextResponse } from 'next/server'

const LENS_API = 'https://api-v2.lens.dev'

interface ChallengeRequest {
  for?: string      // ProfileId (opcional)
  signedBy: string  // EvmAddress
}

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    // 1. Primero obtenemos el default profile
    const profileResponse = await fetch(LENS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query defaultProfile($request: DefaultProfileRequest!) {
            defaultProfile(request: $request) {
              id
              handle {
                fullHandle
              }
              ownedBy {
                address
                chainId
              }
            }
          }
        `,
        variables: {
          request: {
            for: address
          }
        }
      })
    })

    const profileData = await profileResponse.json()
    const profile = profileData.data.defaultProfile

    if (!profile) {
      return NextResponse.json({ 
        error: 'No default profile found' 
      }, { status: 400 })
    }

    // 2. Luego obtenemos el challenge usando el profileId
    const challengeResponse = await fetch(LENS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query challenge($request: ChallengeRequest!) {
            challenge(request: $request) {
              id
              text
            }
          }
        `,
        variables: {
          request: {
            signedBy: address,
            for: profile.id // Incluimos el profileId en el challenge
          }
        },
      }),
    })

    const challengeData = await challengeResponse.json()

    if (challengeData.errors) {
      throw new Error(challengeData.errors[0].message)
    }

    return NextResponse.json({
      ...challengeData.data.challenge,
      profile: {
        id: profile.id,
        handle: profile.handle.fullHandle,
        address: profile.ownedBy.address
      }
    })

  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error fetching challenge' 
    }, { status: 500 })
  }
}