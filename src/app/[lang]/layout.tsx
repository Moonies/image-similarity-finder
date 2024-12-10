import MainLayout from '@/components/layout/MainLayout'
import ThemeRegistry from '@/components/ThemeRegistry'
import LanguageProvider from '@/components/providers/LanguageProvider'
import { LoadingProvider } from '@/components/providers/LoadingProvider'

import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Notification } from '@/components/Notification'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ja' }]
}

export default function MainAppLayout({
  children,
  lang,
}: {
  children: React.ReactNode
  lang: string
}) {
  return (
    <ReduxProvider>
      <LanguageProvider locale={lang}>
        <ThemeRegistry>
          <LoadingProvider>
            <AuthProvider>
              <MainLayout>{children}</MainLayout>
              <Notification />
            </AuthProvider>
          </LoadingProvider>
        </ThemeRegistry>
      </LanguageProvider>
    </ReduxProvider>
  )
}
