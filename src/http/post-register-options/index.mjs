import arc from '@architect/functions'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { rpID, rpName } from '@architect/shared/rp-id.mjs'

const { accounts } = await arc.tables()

async function post (req) {
  const { session, body } = req
  const { username } = body

  // check if user exists
  const existingUser = await accounts.get({ username })
  // TODO: proceed to sign in if user exists
  if (existingUser) {
    session.error = 'Account already exists!'
    return {
      session,
      status: 302,
      headers: {
        location: '/',
      },
    }
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new Uint8Array(Buffer.from(username)),
    userName: username,
    attestationType: 'indirect',
    authenticatorSelection: {
      userVerification: 'required',
    },
    supportedAlgorithmIDs: [-7, -257], // ES256, RS256
  })

  // Store the challenge in the session for verification
  session.challenge = options.challenge

  return {
    session,
    status: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: /*html*/`
<!doctype html>
<head>
  <title>WebAuthN</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/normalize.css">
  <link rel="stylesheet" href="https://unpkg.com/magick.css">
  <script src="https://unpkg.com/@simplewebauthn/browser@10.0.0/dist/bundle/index.umd.min.js"></script>
  <script type="module">
    const { startRegistration } = window.SimpleWebAuthnBrowser
    const options = ${options ? JSON.stringify(options) : 'null'}

    if (options) {
      const attestationResponse = await startRegistration(options)

      const verifyResponse = await fetch('/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: options.user.name,
          attestationResponse,
        }),
      })

      if (verifyResponse.ok) {
        window.location.replace('/')
      }
      else {
        alert('Registration failed!')
        window.location.replace('/')
      }
    }
  </script>
</head>
<body>
  <main>
    <header>
      <h1>Web Auth Demo</h1>
      <h2 style="text-align: center">Built with Architect (Node.js)</h2>
    </header>
    <section>
      <p>Register with your device.</p>
      <p><a href="/">Go back.</a></p>
    </section>
    <footer>
    </footer>
  </main>
</body>
</html>
    `. trim()
  }
}

export const handler = arc.http(post)
