import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { id, signature } = await request.json()

    const response = await fetch('https://api.lens.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Authenticate($request: SignedAuthChallenge!) {
            authenticate(request: $request) {
              accessToken
              refreshToken
              identityToken
            }
          }
        `,
        variables: {
          request: {
            id: id,
            signature: signature,
          },
        },
      }),
    })

    const data = await response.json()
    const { accessToken, refreshToken, identityToken } = data.data.authenticate


    const cookieStore = cookies()
    cookieStore.set('lens.accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60
    })
    cookieStore.set('lens.refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })
    cookieStore.set('lens.identityToken', identityToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60 
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error authenticating' }, { status: 500 })
  }
}