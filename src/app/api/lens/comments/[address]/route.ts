import { NextRequest, NextResponse } from 'next/server'

const LENS_API = 'https://api-v2.lens.dev'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get('cursor')

    const response = await fetch(LENS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ExplorePublications($request: ExplorePublicationRequest!) {
            explorePublications(request: $request) {
              items {
                ... on Post {
                  id
                  createdAt
                  metadata {
                    ... on TextOnlyMetadataV3 {
                      id
                      content
                    }
                  }
                  by {
                    id
                    handle {
                      fullHandle
                    }
                    metadata {
                      displayName
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
                  }
                  stats {
                    reactions
                    comments
                    mirrors
                  }
                }
              }
              pageInfo {
                next
                prev
              }
            }
          }
        `,
        variables: {
          request: {
            where: {
              metadata: {
                tags: {
                  all: [address.toLowerCase(), 'comment', 'capitaltal']
                }
              }
            },
            orderBy: 'CREATED_DESC',
            limit: 10,
            ...(cursor && { cursor })
          }
        }
      })
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    return NextResponse.json({
      comments: data.data.explorePublications.items.map((item: any) => ({
        id: item.id,
        content: item.metadata.content,
        createdAt: item.createdAt,
        author: {
          id: item.by.id,
          handle: item.by.handle.fullHandle,
          displayName: item.by.metadata.displayName,
          picture: item.by.metadata.picture?.optimized?.uri || 
                  item.by.metadata.picture?.image?.optimized?.uri
        },
        stats: item.stats
      })),
      pageInfo: data.data.explorePublications.pageInfo
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch comments' 
    }, { status: 500 })
  }
}