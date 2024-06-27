import arc from '@architect/functions'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { rpID, origin } from '@architect/shared/rp-id.mjs'

const { accounts } = await arc.tables()

async function post (req) {
  const { session, body } = req
  const { challenge: expectedChallenge } = session
  const { username, attestationResponse } = body

  const user = await accounts.get({ username })
  if (user) throw new Error('User already exists!')

  const verification = await verifyRegistrationResponse({
    response: attestationResponse,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  })

  if (!verification.verified) throw new Error('Verification failed!')
  if (!verification.registrationInfo) throw new Error('Registration info empty!')

  const { credentialID, credentialPublicKey } = verification.registrationInfo

  const credential = {
    id: credentialID,
    publicKey: Buffer.from(credentialPublicKey).toString('base64'),
  }

  const newUser = await accounts.put({
    username,
    credential,
  })

  session.user = { username }

  return {
    session,
    json: { user: newUser },
  }
}

export const handler = arc.http(post)
