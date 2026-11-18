import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/src/context/AuthContext'
import { WishlistProvider } from '@/src/context/WishlistContext'
import Layout from '@/src/components/layout/Layout'
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <WishlistProvider>
          {getLayout(<Component {...pageProps} />)}
        </WishlistProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
