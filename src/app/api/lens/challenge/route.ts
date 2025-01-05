import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

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
    return NextResponse.json(data.data.challenge)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching challenge' }, { status: 500 })
  }
}