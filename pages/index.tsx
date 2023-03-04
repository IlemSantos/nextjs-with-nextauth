import Head from 'next/head'
import { Avatar } from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    if (!session.user)
      return <p>Carregando...</p>

    return (
      <>
        <Head>
          <title>Next.js with NextAuth</title>
          <meta name="description" content="next.js with next-auth.js" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <h2>Signed in as {session.user.email} </h2>
          Avatar {session.user.image} <br />
          <Avatar
            name={session.user.email ? session.user.email : undefined}
            src={session.user.image ? session.user.image : undefined} />
          <br />
          <h2>Session</h2>
          <p>/api/auth/session</p>
          <iframe src="/api/auth/session" />
          <h2>JSON Web Token</h2>
          <p>/api/auth/csrf</p>
          <iframe src="/api/auth/csrf" />
          <button onClick={() => signOut()}>Sign out</button>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Next.js with NextAuth</title>
        <meta name="description" content="next.js with next-auth.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h2>Not signed in </h2>
        <button onClick={() => signIn()}>Sign in</button>
      </main>
    </>
  )
}
