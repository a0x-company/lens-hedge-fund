import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { textOnly } from "@lens-protocol/metadata"
import Irys from '@irys/sdk'
import { v4 as uuidv4 } from 'uuid'

function connectToIrys(): Irys {
  const url = 'https://node2.irys.xyz'
  const token = 'matic'
  const pk = process.env.BUNDLR_PK
  return new Irys({ url: url, token: token, key: pk })
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('lens.accessToken')

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { content } = await request.json()

    const metadata = textOnly({
      id: uuidv4(),
      content: content,
      locale: "es",
      tags: ['comment', 'capitaltal'],
      appId: 'capital'
    })

    const irys = connectToIrys()
    const uploadResponse = await irys.upload(Buffer.from(JSON.stringify(metadata)), {
      tags: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'capital' },
        { name: 'Type', value: 'POST' }
      ]
    })

    const contentURI = `https://arweave.net/${uploadResponse.id}`

    const createPostResponse = await fetch('https://api.lens.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`
      },
      body: JSON.stringify({
        query: `
          mutation CreateMomokaPost($request: MomokaPostRequest!) {
            postOnMomoka(request: $request) {
              ... on CreateMomokaPublicationResult {
                id
                proof
                momokaId
              }
              ... on LensProfileManagerRelayError {
                reason
              }
            }
          }
        `,
        variables: {
          request: {
            contentURI
          }
        }
      })
    })

    const postData = await createPostResponse.json()

    return NextResponse.json({
      success: true,
      contentURI,
      ...postData.data.postOnMomoka
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
  }
}