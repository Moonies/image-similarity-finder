import MainLayout from '@/components/layout/MainLayout'
import ThemeRegistry from '@/components/ThemeRegistry'
import LanguageProvider from '@/components/providers/LanguageProvider'
import { LoadingProvider } from '@/components/providers/LoadingProvider'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ConfirmModalProvider } from '@/components/providers/ConfirmProvider'
import { Notification } from '@/components/Notification'
import { ThemeContextProvider } from '@/context/ThemeContext'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'jp' }]
}

export default async function MainAppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { lang } = await params
  return (
    <ReduxProvider>
      <LanguageProvider locale={lang}>
        <ThemeContextProvider>
          <ThemeRegistry>
            <LoadingProvider>
              <AuthProvider>
                <ConfirmModalProvider>
                  <MainLayout>{children}</MainLayout>
                </ConfirmModalProvider>
                <Notification />
              </AuthProvider>
            </LoadingProvider>
          </ThemeRegistry>
        </ThemeContextProvider>
      </LanguageProvider>
    </ReduxProvider>
  )
}
