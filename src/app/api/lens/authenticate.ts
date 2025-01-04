import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id, signature } = req.body

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
    res.status(200).json(data.data.authenticate)
  } catch (error) {
    res.status(500).json({ error: 'Error authenticating' })
  }
}