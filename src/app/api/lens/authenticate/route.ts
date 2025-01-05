import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const LENS_API = 'https://api-v2.lens.dev'

interface SignedAuthChallenge {
  id: string
  signature: string
}

interface BroadcastRequest {
  id: string
  signature: string
}

export async function POST(request: NextRequest) {
  try {
    const { id, signature, address }: SignedAuthChallenge & { address: string } = await request.json()

    // 1. Autenticar con Lens
    const authResponse = await fetch(LENS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation authenticate($request: SignedAuthChallenge!) {
            authenticate(request: $request) {
              accessToken
              refreshToken
              identityToken
            }
          }
        `,
        variables: {
          request: {
            id,
            signature,
          },
        },
      }),
    })

    const authData = await authResponse.json()
    
    if (authData.errors) {
      throw new Error(authData.errors[0].message)
    }

    const { accessToken, refreshToken, identityToken } = authData.data.authenticate

    // 2. Obtener el perfil del usuario
    const profileResponse = await fetch(LENS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        query: `
          query defaultProfile($request: DefaultProfileRequest!) {
            defaultProfile(request: $request) {
              id
              handle {
                fullHandle
                localName
                namespace
              }
              signless
              ownedBy {
                address
                chainId
              }
              metadata {
                displayName
                bio
                picture {
                  ... on ImageSet {
                    optimized {
                      uri
                    }
                  }
                  ... on NftImage {
                    image {
                      optimized {
                        uri
                      }
                    }
                  }
                }
              }
              stats {
                followers
                following
                posts
                comments
                mirrors
                quotes
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

    // Configurar cookies
    const cookieStore = cookies()
    
    // Tokens de autenticación
    cookieStore.set('lens.accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60 // 30 minutos
    })

    cookieStore.set('lens.refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    })

    cookieStore.set('lens.identityToken', identityToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60 // 30 minutos
    })

    // Información del perfil (no sensible)
    cookieStore.set('lens.profile', JSON.stringify({
      id: profile.id,
      handle: profile.handle.fullHandle,
      localName: profile.handle.localName,
      displayName: profile.metadata.displayName,
      picture: profile.metadata.picture?.optimized?.uri || 
               profile.metadata.picture?.image?.optimized?.uri,
      stats: profile.stats
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60 // 30 minutos
    })

    // 3. Verificar si necesita activar signless
    if (!profile.signless) {
      // 4. Generar typedData para activar signless
      const typedDataResponse = await fetch(LENS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          query: `
            mutation createChangeProfileManagersTypedData($request: ChangeProfileManagersRequest!) {
              createChangeProfileManagersTypedData(
                request: {
                  approveSignless: true
                }
              ) {
                id
                expiresAt
                typedData {
                  types {
                    ChangeDelegatedExecutorsConfig {
                      name
                      type
                    }
                  }
                  domain {
                    name
                    chainId
                    version
                    verifyingContract
                  }
                  value {
                    nonce
                    deadline
                    delegatorProfileId
                    delegatedExecutors
                    approvals
                    configNumber
                    switchToGivenConfig
                  }
                }
              }
            }
          `
        })
      })

      const { id: signlessId, typedData } = (await typedDataResponse.json()).data
        .createChangeProfileManagersTypedData

      return NextResponse.json({
        success: true,
        needsSignless: true,
        signlessData: {
          id: signlessId,
          typedData
        },
        profile: {
          id: profile.id,
          handle: profile.handle.fullHandle,
          displayName: profile.metadata.displayName,
          picture: profile.metadata.picture?.optimized?.uri || 
                   profile.metadata.picture?.image?.optimized?.uri,
          stats: profile.stats
        }
      })
    }

    return NextResponse.json({ 
      success: true,
      needsSignless: false,
      profile: {
        id: profile.id,
        handle: profile.handle.fullHandle,
        displayName: profile.metadata.displayName,
        picture: profile.metadata.picture?.optimized?.uri || 
                 profile.metadata.picture?.image?.optimized?.uri,
        stats: profile.stats
      }
    })

  } catch (error) {
    console.error('Error in authentication:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    }, { status: 500 })
  }
}

// Endpoint para habilitar signless
export async function PUT(request: NextRequest) {
  try {
    const { id , signature }: BroadcastRequest = await request.json()
    const accessToken = cookies().get('lens.accessToken')

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const broadcastResponse = await fetch(LENS_API, {
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

    const broadcastData = await broadcastResponse.json()

    if (broadcastData.errors) {
      throw new Error(broadcastData.errors[0].message)
    }

    return NextResponse.json({
      success: true,
      ...broadcastData.data.broadcastOnchain
    })
  } catch (error) {
    console.error('Error enabling signless:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to enable signless' 
    }, { status: 500 })
  }
}