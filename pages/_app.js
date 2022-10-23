// pages/_app.js
import { SessionProvider, useSession } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return children
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </Auth>
      ) : (
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      )}
    </SessionProvider>
  )
}

export default MyApp
