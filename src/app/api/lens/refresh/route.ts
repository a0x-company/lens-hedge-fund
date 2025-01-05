import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('lens.refreshToken')

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  try {
    const response = await fetch('https://api.lens.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Refresh($request: RefreshRequest!) {
            refresh(request: $request) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: {
          request: {
            refreshToken: refreshToken.value,
          },
        },
      }),
    })

    const data = await response.json()
    const { accessToken, refreshToken: newRefreshToken } = data.data.refresh

    cookieStore.set('lens.accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 60 
    })
    cookieStore.set('lens.refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error refreshing token' }, { status: 500 })
  }
}