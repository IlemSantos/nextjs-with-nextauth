import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextRequest) {
    // return NextResponse
    return NextResponse.rewrite(new URL('/dashboard', req.url))
  },
  {
    callbacks: {
      authorized({ token }) {
        return token?.role !== undefined && token.role === 'user'
      }
    }
  }
)

export const config = { matcher: ["/dashboard"] }
