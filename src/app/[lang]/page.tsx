'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Container, Link, Typography } from '@mui/material'
import PageTransition from '@/components/PageTransition'
import { useThemeContext } from '@/context/ThemeContext'
import parse, { DOMNode, HTMLReactParserOptions } from 'html-react-parser'
import packageInfo from '@/../package.json'

const mockApi = {
  htmlString: {
    en: '<style> \
          h1 { \
            font-size: 48px; \
          } \
          h2 { \
            font-size: 32px; \
          } \
          body { \
            font-size: 22px; \
          } \
        </style> \
        <div> \
          <h1>Getting Started</h1> \
          <p>We are excited to have you onboard. This app is designed to help streamline your workflow, manage records, and enhance your productivity. Explore its powerful features below.</p> \
          <a href="/static/files/dummy_5mb.pdf" download>Download Our Privacy Policy Document &#169; Copyright 2025</a> \
          <h2>Quick Guide</h2> \
          <ul> \
            <li>Upload images in the "Upload" section.</li> \
            <li>Manage your records in the "Check Records" section. Customize columns and search efficiently.</li> \
            <li>Remove unwanted data in the "Eraser" section.</li> \
            <li>Manage users under "User Management".</li> \
            <li>Switch between light and dark modes using the toggle in the sidebar.</li> \
          </ul> \
          <p>To get started, checkout the <a href="/static/files/dummy_5mb.pdf" target="_blank">User Manual</a> guide.</p> \
          <h2>Key Features</h2> \
          <ul> \
            <li>Upload: Seamlessly upload images and manage them.</li> \
            <li>Record Management: Easily manage and customize your data columns, from material costs to suppliers.</li> \
            <li>Real-time Chat Support: Get quick assistance through our chat feature.</li> \
            <li>User Management: Control user roles and permissions effectively.</li> \
            <li>Dark/Light Mode Toggle: Toggle between modes for a personalized experience.</li> \
          </ul> \
          <div> \
            <p>See how easy it is to manage your workflow with <strong>早楽図面</strong>.</p> \
            <iframe width="560" height="315" src="https://www.youtube.com/embed/OrRffCobuts" title="Getting Started with NextJS and PrimeReact" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> \
          </div>\
          <h2>User Support</h2> \
          <p>If you encounter any issues or need help, contact our support team via email at <strong>support@sansenshimizu.com</strong>.</p> \
          <div> \
            <p>(Sample Image)</p> \
            <img src="/static/images/blueprint.png" alt="Sample Image" style="width: 400px; height: auto" /> \
          </div> \
        </div>',
    jp: '<style> \
          h1 { \
            font-size: 48px; \
          } \
          h2 { \
            font-size: 32px; \
          } \
          body { \
            font-size: 22px; \
          } \
        </style> \
        <div> \
        <h1>はじめ</h1> \
          <p>私たちは、あなたが参加してくれたことにとても興奮しています。このアプリは、ワークフローの効率化、記録の管理、生産性の向上をサポートするために設計されています。以下の強力な機能をぜひお試しください。</p> \
          <p>早楽図面を使って、ワークフローを簡単に管理する方法をご覧ください。</p> \
          <a href="/static/files/dummy_5mb.pdf" download>プライバシーポリシー文書をダウンロード &#169; Copyright 2025</a> \
          <h2>クイックガイド</h2> \
          <ul> \
            <li>「アップロード」セクションで画像をアップロードします。</li> \
            <li>「記録チェック」セクションで記録を管理します。列をカスタマイズし、効率的に検索できます。</li> \
            <li>「イレイザー」セクションで不要なデータを削除します。</li> \
            <li>「ユーザー管理」でユーザーを管理します。</li> \
            <li>サイドバーのトグルでライトモードとダークモードを切り替えます。</li> \
          </ul> \
          <p>始めるには、<a href="/static/files/dummy_5mb.pdf" target="_blank">ユーザーマニュアル</a> ガイドをご確認ください。</p> \
          <h2>主な機能</h2> \
          <ul> \
            <li>アップロード機能：画像をシームレスにアップロードして管理できます。</li> \
            <li>記録管理：データ列（材料費やサプライヤーなど）を簡単に管理・カスタマイズできます。</li> \
            <li>リアルタイムチャットサポート：チャット機能を通じて迅速なサポートを受けられます。</li> \
            <li>ユーザー管理：ユーザーの役割と権限を効果的に管理します。</li> \
            <li>ダーク/ライトモードのトグル：モードを切り替えて、パーソナライズされた体験を提供します。</li> \
          </ul> \
          <div> \
            <p><strong>早楽図面</strong>を使って、ワークフローを簡単に管理する方法をご覧ください。</p> \
            <iframe width="560" height="315" src="https://www.youtube.com/embed/OrRffCobuts" title="NextJSとPrimeReactを使ったスタートガイド" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> \
          </div>\
          <h2>ユーザーサポート</h2> \
          <p>何か問題が発生した場合やサポートが必要な場合は、<strong>support@sansenshimizu.com</strong> までメールでお問い合わせください。</p> \
          <div> \
            <p>(サンプルイメージ)</p> \
            <img src="/static/images/blueprint.png" alt="画像" style="width: 400px; height: auto" /> \
          </div> \
         </div>',
    zh: '',
    vi: '',
  },
}

interface TransformNode {
  type: string
  name: string
  children: Array<{ data: string }>
  attribs: {
    href?: string
    target?: string
    download?: boolean
  }
}

export default function Home() {
  const { mode } = useThemeContext()
  const { locale } = useThemeContext()
  const { t } = useTranslation('welcome-page')

  const [htmlStringData, setHtmlStringData] = useState<string>()

  const version = packageInfo.version

  const options: HTMLReactParserOptions = {
    replace(domNode: DOMNode) {
      const node = domNode as TransformNode

      if (node.type === 'tag' && node.attribs && node.name === 'a') {
        return (
          <Link
            href={node.attribs.href || '#'}
            target={node.attribs.target || '_blank'}
            fontWeight='bold'
            sx={{
              color:
                mode === 'dark'
                  ? theme => theme.palette.warning.light
                  : theme => theme.palette.primary.main,
              textDecoration: 'none',
            }}
            download={node.attribs.download || false}
          >
            {node.children[0].data}
          </Link>
        )
      }

      return false
    },
  }

  // fetch mock data
  const getHtmlString = useMemo(
    () => async () => {
      const htmlString = await mockApi.htmlString
      const resultData = htmlString[locale]
      if (resultData) {
        setHtmlStringData(resultData)
      }
    },
    [locale]
  )

  useEffect(() => {
    getHtmlString()
  }, [getHtmlString])

  return (
    <PageTransition>
      <Box p={2}>
        <Container maxWidth='lg'>
          <Typography variant='h1'>{t('title')}</Typography>

          <Box marginY={2}>
            <Typography variant='h3' gutterBottom>
              {t('appVersion.title')}
            </Typography>
            <Typography variant='h5'>
              {t('appVersion.label')} : {version}
            </Typography>
          </Box>

          <Box
            paddingY={4}
            paddingX={6}
            marginY={4}
            sx={{
              backgroundColor:
                mode === 'dark'
                  ? theme => `${theme.palette.warning.light}10`
                  : theme => `${theme.palette.primary.light}10`,
            }}
            borderLeft={
              mode === 'dark'
                ? theme => `4px solid ${theme.palette.warning.light}`
                : theme => `4px solid ${theme.palette.primary.light}`
            }
            borderRadius={2}
          >
            <Typography variant='h4' gutterBottom>
              {t('note.title')}
            </Typography>
            <Typography variant='h6' gutterBottom>
              {parse(t('note.description1', { version: version }))}
            </Typography>
            <Typography variant='h6'>
              {t('note.description2')}
              <Link
                href='#'
                fontWeight='bold'
                sx={{
                  color:
                    mode === 'dark'
                      ? theme => theme.palette.warning.light
                      : theme => theme.palette.primary.main,
                }}
              >
                {t('note.invitation.subscriptionLink')}
              </Link>{' '}
              {t('note.invitation.conjuction')}{' '}
              <Link
                href='#'
                fontWeight='bold'
                sx={{
                  color:
                    mode === 'dark'
                      ? theme => theme.palette.warning.light
                      : theme => theme.palette.primary.main,
                }}
              >
                {t('note.invitation.contactLink')}
              </Link>{' '}
              {t('note.invitation.label')}
            </Typography>
          </Box>

          {/* Information from Backend */}
          {parse(htmlStringData ?? '', options)}
        </Container>
      </Box>
    </PageTransition>
  )
}
