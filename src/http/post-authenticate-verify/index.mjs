import arc from '@architect/functions'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { rpID, origin } from '@architect/shared/rp-id.mjs'

const { accounts } = await arc.tables()

async function post (req) {
  const { session, body } = req
  const { challenge: expectedChallenge } = session
  const { username, assertionResponse } = body

  const user = await accounts.get({ username })
  if (!user?.credential) throw new Error('User not found!')

  const credentialID = user.credential.id
  const credentialPublicKey = Uint8Array.from(Buffer.from(user.credential.publicKey, 'base64'))

  if (assertionResponse.id !== credentialID) throw new Error('Credential mismatch!')

  const verification = await verifyAuthenticationResponse({
    response: assertionResponse,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialPublicKey,
      credentialID,
      counter: 0,
    },
  })

  if (!verification.verified) throw new Error('Verification failed!')

  session.user = { username }

  return {
    session,
    json: { user },
  }
}

export const handler = arc.http(post)
