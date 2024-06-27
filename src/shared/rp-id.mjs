import process from 'node:process'

const { ARC_ENV } = process.env
const rpIDs = {
  production: 'friend-mjg.begin.app',
  staging: 'play-fc6.begin.app',
  testing: 'localhost',
}
const rpNames = {
  production: 'T Beseda',
  staging: 'T Beseda Staging',
  testing: 'T Beseda Testing',
}
const rpID = rpIDs[ARC_ENV] || rpIDs.testing
const rpName = rpNames[ARC_ENV] || rpNames.testing
const origin = ARC_ENV === 'testing' ? 'http://localhost:3333' : `https://${rpID}`

export { rpID, rpName, origin }
