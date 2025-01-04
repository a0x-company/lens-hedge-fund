import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const refreshToken = req.cookies['lens.refreshToken']

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' })
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
            refreshToken,
          },
        },
      }),
    })

    const data = await response.json()
    const { accessToken, refreshToken: newRefreshToken } = data.data.refresh

    // Actualizar las cookies
    res.setHeader('Set-Cookie', [
      serialize('lens.accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 30 * 60 // 30 minutos
      }),
      serialize('lens.refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 días
      })
    ])

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error refreshing token' })
  }
}