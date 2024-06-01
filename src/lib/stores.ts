import { persistentAtom } from '@nanostores/persistent'
import { humanId } from 'human-id'

const generateSessionToken = () => humanId({ capitalize: false, addAdverb: false })

export const sessionToken = persistentAtom('sessionToken', generateSessionToken())
export const resetSessionToken = () => sessionToken.set(generateSessionToken())