<div align="center" width="50%" style="width: 50%; margin: 0 auto">

![cartoon padlock](webauthn-padlock-comic.jpg)

</div>

# WebAuthn with [Architect](https://arc.codes)

## [Read the article](https://begin.com/blog/posts/2024-07-02-webauthn-with-arc)

This is a simple example of how to use WebAuthn with Architect. It's a barebones web app that allows you to register and authenticate with WebAuthn APIs.

## Run this app

This is a pretty vanilla [Architect](https://arc.codes) application. Not an [Enhance](https://enhance.dev) app... yet!

Here's a quick look at the routes in the `app.arc` manifest:

```
@http
get  /                     # HTML forms
post /register/options     # HTML for generateRegistrationOptions
post /register/verify      # JSON to verifyRegistrationResponse
post /authenticate/options # HTML for generateAuthenticationOptions
post /authenticate/verify  # JSON to verifyAuthenticationResponse
any  /logout               # delete the session
```

To run this app locally:

```sh
$ npm install
$ npm start
```
