import { authService } from './firebaseAuth'

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const currentUser = authService.getCurrentUser()

  if (!currentUser) {
    throw new Error('A signed-in user is required for this request.')
  }

  const idToken = await currentUser.getIdToken()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${idToken}`)

  return fetch(input, {
    ...init,
    headers,
  })
}
