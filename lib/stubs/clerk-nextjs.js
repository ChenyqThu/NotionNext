import { Fragment } from 'react'

const authState = {
  isLoaded: true,
  isSignedIn: false,
  sessionId: null,
  user: null,
  userId: null,
  getToken: async () => null
}

const renderChildren = ({ children }) => <Fragment>{children ?? null}</Fragment>
const renderNothing = () => null

export const ClerkProvider = renderChildren
export const SignedOut = renderChildren
export const SignedIn = renderNothing
export const SignInButton = renderChildren
export const SignOutButton = renderChildren
export const SignIn = renderNothing
export const SignUp = renderNothing
export const UserButton = renderNothing
export const UserProfile = renderNothing

export const useUser = () => authState

export const useAuth = () => ({
  ...authState,
  signOut: async () => undefined
})

export const useClerk = () => ({
  openSignIn: () => undefined,
  openSignUp: () => undefined,
  signOut: async () => undefined
})

export default {
  ClerkProvider,
  SignedOut,
  SignedIn,
  SignInButton,
  SignOutButton,
  SignIn,
  SignUp,
  UserButton,
  UserProfile,
  useUser,
  useAuth,
  useClerk
}
