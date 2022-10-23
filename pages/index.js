import { useSession, signIn, signOut } from "next-auth/react"
import { Avatar } from "@chakra-ui/react"

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return <>
      Signed in as {session.user.email} <br />
      Avatar {session.user.image} <br />
      <Avatar name={session.user.email} src={session.user.image} /> <br />
      <h2>Session</h2>
      <p>/api/auth/session</p>
      <iframe src="/api/auth/session" />
      <h2>JSON Web Token</h2>
      <p>/api/auth/csrf</p>
      <iframe src="/api/auth/csrf" />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    Not signed in <br />
    <button onClick={() => signIn()}>Sign in</button>
  </>
}
