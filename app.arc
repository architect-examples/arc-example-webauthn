@app
arc-webauthn

@aws
runtime nodejs20.x

@http
get  /                     # HTML forms
post /register/options     # HTML for generateRegistrationOptions
post /register/verify      # JSON to verifyRegistrationResponse
post /authenticate/options # HTML for generateAuthenticationOptions
post /authenticate/verify  # JSON to verifyAuthenticationResponse
any  /logout               # delete the session

@tables
accounts
  username *String

@begin
appID NCH2LLB2
# production: https://friend-mjg.begin.app
# staging: https://play-fc6.begin.app
