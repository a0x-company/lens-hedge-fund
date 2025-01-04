import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { address } = req.body

    const response = await fetch('https://api.lens.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Challenge($address: EthereumAddress!) {
            challenge(request: { address: $address }) {
              text
              id
            }
          }
        `,
        variables: {
          address: address,
        },
      }),
    })

    const data = await response.json()
    res.status(200).json(data.data.challenge)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching challenge' })
  }
}