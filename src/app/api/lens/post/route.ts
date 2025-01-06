import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { textOnly } from "@lens-protocol/metadata"
import Irys from '@irys/sdk'
import { v4 as uuidv4 } from 'uuid'

const LENS_API = 'https://api-v2.lens.dev'

function connectToIrys(): Irys {
  const url = 'https://node2.irys.xyz'
  const token = 'matic'
  const pk = process.env.BUNDLR_PK
  if (!pk) throw new Error('BUNDLR_PK not found in environment variables')
  return new Irys({ url, token, key: pk })
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('lens.accessToken')

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { content, tokenAddress } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (!tokenAddress?.trim()) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 })
    }

    // 1. Crear metadata
    const metadata = textOnly({
      id: uuidv4(),
      content: content.trim(),
      locale: "es",
      tags: ['comment', 'capitaltal', tokenAddress],
      appId: 'capital'
    })

    // 2. Subir a Irys
    const irys = connectToIrys()
    const uploadResponse = await irys.upload(Buffer.from(JSON.stringify(metadata)), {
      tags: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'capital' },
        { name: 'Type', value: 'POST' },
        { name: 'Token-Address', value: tokenAddress }
      ]
    })

    const contentURI = `https://arweave.net/${uploadResponse.id}`

    // 3. Crear post en Lens
    const createPostResponse = await fetch(LENS_API, {
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
            contentURI,
            // Puedes agregar más opciones aquí si es necesario
            // referenceModule: { followerOnlyReferenceModule: false }
          }
        }
      })
    })

    const postData = await createPostResponse.json()

    // 4. Verificar errores en la respuesta
    if (postData.errors) {
      console.error('Lens API Error:', postData.errors)
      return NextResponse.json({ 
        error: postData.errors[0].message 
      }, { status: 400 })
    }

    if ('reason' in postData.data.postOnMomoka) {
      return NextResponse.json({ 
        error: postData.data.postOnMomoka.reason 
      }, { status: 400 })
    }

    // 5. Retornar respuesta exitosa
    return NextResponse.json({
      success: true,
      contentURI,
      ...postData.data.postOnMomoka
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error creating post' 
    }, { status: 500 })
  }
}