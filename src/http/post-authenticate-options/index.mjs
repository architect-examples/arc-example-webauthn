import arc from '@architect/functions'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { rpID, rpName } from '@architect/shared/rp-id.mjs'

const { accounts } = await arc.tables()

async function post (req) {
  const { session, body } = req
  const { username } = body

  const existingUser = await accounts.get({ username })
  if (!existingUser?.credential) {
    session.error = 'User not found!'
    return {
      session,
      status: 302,
      headers: {
        location: '/',
      },
    }
  }

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials: [
      {
        id: existingUser.credential.id,
        transports: ['internal', 'usb', 'ble', 'nfc'],
      },
    ],
  })

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
    const { startAuthentication } = window.SimpleWebAuthnBrowser
    const options = ${options ? JSON.stringify(options) : 'null'}

    if (options) {
      const assertionResponse = await startAuthentication(options)

      const verifyResponse = await fetch('/authenticate/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: '${username}',
          assertionResponse,
        }),
      })

      if (verifyResponse.ok)
        window.location.replace('/')
      else {
        alert('Sign in failed!')
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
      <p>Sign in with your registered device.</p>
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
