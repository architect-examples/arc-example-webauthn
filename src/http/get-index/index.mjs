import arc from '@architect/functions'

async function get (req) {
  const { session } = req
  const { error, user } = session

  let message = ''
  if (error) {
    message = error
    delete session.error
  }

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
</head>
<body>
  <main>
    <header>
      <h1>Web Auth Demo</h1>
      <h2 style="text-align: center;">Built with Architect (Node.js)</h2>
      ${message && /*html*/`
        <h3 style="color: red; text-align: center;">${message}</h3>
      `}
    </header>
    ${user?.username
      ? /*html*/`
        <section>
          <h3>Hello, ${user.username} 🤘</h3>
          <p>
            You are authenticated!<span class="sidenote-anchor"></span>
            <span class="sidenote">That's the extent of the demo. This does nothing else.</span>
            <br>
            You can <a href="/logout">logout</a> if you want.
            Then log back in or sign up again with a different username.
          </p>
          <p><a href="/logout">Logout.</a></p>
        </section>
      `
      : /*html*/`
        <section>
          <h3>Authenticate</h3>
          <p>If you have registered, start authentication with your username.</p>
          <form method="POST" action="/authenticate/options">
            <label for="username">Your Chosen Username</label>
            <input type="text" name="username" placeholder="Fr0do" required>
            <button type="submit">Authenticate</button>
          </form>
        </section>

        <section>
          <h3>Register</h3>
          <p>
            Pick a username to create a new account.
            It really doesn't matter - it won't be used for anything except signing in.
            Something you can remember.
          </p>
          <form method="POST" action="/register/options">
            <label for="username">Choose a Username</label>
            <input type="text" name="username" placeholder="G4nd4lf" required>
            <button type="submit">Register</button>
          </form>
        </section>
      `
    }
    <footer>
    </footer>
  </main>
</body>
</html>
    `. trim()
  }
}

export const handler = arc.http(get)
