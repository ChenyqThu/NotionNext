const authState = {
  userId: null,
  sessionId: null,
  orgId: null,
  getToken: async () => null,
  protect: async () => null
}

export const getAuth = () => authState
export const auth = () => authState
export const clerkMiddleware = () => undefined
export const createRouteMatcher = () => () => false

export default {
  getAuth,
  auth,
  clerkMiddleware,
  createRouteMatcher
}
