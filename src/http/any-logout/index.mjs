import arc from '@architect/functions'

async function any () {
  return {
    session: {},
    statusCode: 302,
    headers: {
      location: '/',
    },
  }
}

export const handler = arc.http(any)
