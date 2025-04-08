'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Container, Link, MenuItem, TextField, Typography } from '@mui/material'
import PageTransition from '@/components/PageTransition'
import { useThemeContext } from '@/context/ThemeContext'
import parse, { DOMNode, HTMLReactParserOptions } from 'html-react-parser'
import { extractTextFromPDF, processPDFText, reformatText } from '@/utils/fileConvert'
import { motion, AnimatePresence } from 'framer-motion'
import { Download as DownloadIcon } from '@mui/icons-material'
import { useAppSelector } from '@/hooks/useRedux'
import { getAuthenticated } from '@/store/slices/authSlice'

// waiting for backend update
// const mockApi = {
//   htmlString: {
//     en: '<style> \
//           h1 { \
//             font-size: 48px; \
//           } \
//           h2 { \
//             font-size: 32px; \
//           } \
//           body { \
//             font-size: 22px; \
//           } \
//         </style> \
//         <div> \
//           <h1>Getting Started</h1> \
//           <p>We are excited to have you onboard. This app is designed to help streamline your workflow, manage records, and enhance your productivity. Explore its powerful features below.</p> \
//           <a href="/static/files/dummy_5mb.pdf" download>Download Our Privacy Policy Document &#169; Copyright 2025</a> \
//           <h2>Quick Guide</h2> \
//           <ul> \
//             <li>Upload images in the "Upload" section.</li> \
//             <li>Manage your records in the "Check Records" section. Customize columns and search efficiently.</li> \
//             <li>Remove unwanted data in the "Eraser" section.</li> \
//             <li>Manage users under "User Management".</li> \
//             <li>Switch between light and dark modes using the toggle in the sidebar.</li> \
//           </ul> \
//           <p>To get started, checkout the <a href="/static/files/dummy_5mb.pdf" target="_blank">User Manual</a> guide.</p> \
//           <h2>Key Features</h2> \
//           <ul> \
//             <li>Upload: Seamlessly upload images and manage them.</li> \
//             <li>Record Management: Easily manage and customize your data columns, from material costs to suppliers.</li> \
//             <li>Real-time Chat Support: Get quick assistance through our chat feature.</li> \
//             <li>User Management: Control user roles and permissions effectively.</li> \
//             <li>Dark/Light Mode Toggle: Toggle between modes for a personalized experience.</li> \
//           </ul> \
//           <h2>User Support</h2> \
//           <p>If you encounter any issues or need help, contact our support team via email at <strong>support@sansenshimizu.com</strong>.</p> \
//         </div>',
//     jp: '<style> \
//           h1 { \
//             font-size: 48px; \
//           } \
//           h2 { \
//             font-size: 32px; \
//           } \
//           body { \
//             font-size: 22px; \
//           } \
//         </style> \
//         <div> \
//         <h1>はじめ</h1> \
//           <p>私たちは、あなたが参加してくれたことにとても興奮しています。このアプリは、ワークフローの効率化、記録の管理、生産性の向上をサポートするために設計されています。以下の強力な機能をぜひお試しください。</p> \
//           <p>早楽図面を使って、ワークフローを簡単に管理する方法をご覧ください。</p> \
//           <a href="/static/files/dummy_5mb.pdf" download>プライバシーポリシー文書をダウンロード &#169; Copyright 2025</a> \
//           <h2>クイックガイド</h2> \
//           <ul> \
//             <li>「アップロード」セクションで画像をアップロードします。</li> \
//             <li>「記録チェック」セクションで記録を管理します。列をカスタマイズし、効率的に検索できます。</li> \
//             <li>「イレイザー」セクションで不要なデータを削除します。</li> \
//             <li>「ユーザー管理」でユーザーを管理します。</li> \
//             <li>サイドバーのトグルでライトモードとダークモードを切り替えます。</li> \
//           </ul> \
//           <p>始めるには、<a href="/static/files/dummy_5mb.pdf" target="_blank">ユーザーマニュアル</a> ガイドをご確認ください。</p> \
//           <h2>主な機能</h2> \
//           <ul> \
//             <li>アップロード機能：画像をシームレスにアップロードして管理できます。</li> \
//             <li>記録管理：データ列（材料費やサプライヤーなど）を簡単に管理・カスタマイズできます。</li> \
//             <li>リアルタイムチャットサポート：チャット機能を通じて迅速なサポートを受けられます。</li> \
//             <li>ユーザー管理：ユーザーの役割と権限を効果的に管理します。</li> \
//             <li>ダーク/ライトモードのトグル：モードを切り替えて、パーソナライズされた体験を提供します。</li> \
//           </ul> \
//           <h2>ユーザーサポート</h2> \
//           <p>何か問題が発生した場合やサポートが必要な場合は、<strong>support@sansenshimizu.com</strong> までメールでお問い合わせください。</p> \
//          </div>',
//     zh: '',
//     vi: '',
//   },
// }

// interface TransformNode {
//   type: string
//   name: string
//   children: Array<{ data: string }>
//   attribs: {
//     href?: string
//     target?: string
//     download?: boolean
//   }
// }

type ManualFile = {
  fileName: string
  blobUrl: string
}[]

export default function WelcomPage({ files }: { files: string[] }) {
  const { mode } = useThemeContext()
  // const { locale } = useThemeContext()
  const { t } = useTranslation('welcome-page')
  const [manualFiles, setManualFiles] = useState<ManualFile>([])
  const [pdfText, setPdfText] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<string>('')
  const { token } = useAppSelector(state => state.auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // waiting for backend update
  // const [htmlStringData, setHtmlStringData] = useState<string>()

  const version = process.env.APP_VERSION
  const mockFile = useMemo(
    () => [
      { fileName: 'Changelog x.x.x', fileUrl: 'static/files/Changelog-Vx.x.x.pdf' },
      { fileName: 'Changelog 1.0.8', fileUrl: 'static/files/changelog V1.0.8.pdf' },
      // { fileName: 'changelog_JP 1.0.8', fileUrl: 'static/files/changelog_JP V1.0.8.pdf' },
      { fileName: 'changelog_JP 1.0.8', fileUrl: 'static/files/changelog V1.0.8_JP.pdf' },
    ],
    []
  )
  // waiting for backend update
  // const options: HTMLReactParserOptions = {
  //   replace(domNode: DOMNode) {
  //     const node = domNode as TransformNode

  //     if (node.type === 'tag' && node.attribs && node.name === 'a') {
  //       return (
  //         <Link
  //           href={node.attribs.href || '#'}
  //           target={node.attribs.target || '_blank'}
  //           fontWeight='bold'
  //           sx={{
  //             color:
  //               mode === 'dark'
  //                 ? theme => theme.palette.warning.light
  //                 : theme => theme.palette.primary.main,
  //             textDecoration: 'none',
  //           }}
  //           download={node.attribs.download || false}
  //         >
  //           {node.children[0].data}
  //         </Link>
  //       )
  //     }

  //     return false
  //   },
  // }

  // fetch mock data
  // const getHtmlString = useMemo(
  //   () => async () => {
  //     const htmlString = await mockApi.htmlString
  //     const resultData = htmlString[locale]
  //     if (resultData) {
  //       setHtmlStringData(resultData)
  //     }
  //   },
  //   [locale]
  // )

  const handleDownload = useCallback(async () => {
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      const selectedData = manualFiles.find(item => item.fileName === selectedFile)
      if (!selectedData) return
      const link = document.createElement('a')
      link.href = selectedData.blobUrl
      link.download = selectedData.fileName // Use the file's original name
      link.click()
    } else {
      const selectedData = mockFile.find(item => item.fileName === selectedFile)
      if (!selectedData) return
      const response = await fetch(selectedData.fileUrl)
      // Convert the response into a Blob
      const blob = await response.blob()

      // Create a temporary URL for the Blob
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${selectedData.fileName}.pdf`
      link.click()
    }
  }, [manualFiles, mockFile, selectedFile])

  const handleSelectFile = useCallback(
    (fileName: string) => {
      if (process.env.NEXT_PUBLIC_ENV !== 'development') {
        const selectedFile = manualFiles.find(item => item.fileName === fileName)
        if (selectedFile) {
          setSelectedFile(selectedFile?.fileName)
          fetchPDF(selectedFile?.blobUrl)
        }
      } else {
        const selectedFile = mockFile.find(item => item.fileName === fileName)
        if (selectedFile) {
          setSelectedFile(selectedFile?.fileName)
          fetchPDF(selectedFile?.fileUrl)
        }
      }
    },
    [manualFiles, mockFile]
  )

  const fetchPDF = async (selectedFile: string) => {
    try {
      // Fetch the PDF from the public folder
      // const fileURL = "/changelog.pdf"; // Relative path to the PDF file in the public folder

      // Extract and process the text
      const extractedText = await extractTextFromPDF(selectedFile)
      const reformText = reformatText(extractedText)
      const processedText = processPDFText(reformText)
      setPdfText(processedText)
    } catch (err) {
      // setError("Failed to fetch or process the PDF. Please try again.");
      console.error(err)
    }
  }

  const fetchFiles = async () => {
    // Fetch from the dynamic API route
    const response = await fetch(`/read-files/`)
    const data = await response.json()
    const processedFiles = data.files.map((file: { fileName: string; content: string }) => {
      const binary = atob(file.content) // Decode base64 to binary
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const blob = new Blob([bytes]) // Create a Blob from the binary data
      const blobUrl = URL.createObjectURL(blob) // Create a URL for the Blob
      return { fileName: file.fileName, blobUrl } // Return the file name and Blob URL
    })
    setManualFiles(processedFiles)
    fetchPDF(processedFiles[0].blobUrl)
    setSelectedFile(processedFiles[0].fileName)
  }

  useEffect(() => {
    setIsAuthenticated(getAuthenticated())
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      //on local can't find path on docker
      fetchFiles()
    } else {
      fetchPDF(mockFile[0].fileUrl)
      setSelectedFile(mockFile[0].fileName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Re-fetch if `lang` changes

  // useEffect(() => {
  //   getHtmlString()
  // }, [getHtmlString])

  useEffect(() => {
    setIsAuthenticated(getAuthenticated())
  }, [token])

  return (
    <PageTransition>
      <Box
        padding={2}
        sx={{
          backgroundColor:
            mode === 'dark'
              ? theme => theme.palette.background.default
              : theme => theme.palette.background.paper,
        }}
      >
        {isAuthenticated && (
          <Container maxWidth='lg'>
            <Typography variant='h1' textAlign={'center'}>
              {t('title')}
            </Typography>

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
                {/* {t('note.description1', { version: version })} */}
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

            {manualFiles.length > 0 && (
              <Box display={'flex'} gap={2}>
                <TextField
                  id='change-log-select'
                  select
                  label={t('changeLogTitle')}
                  onChange={e => handleSelectFile(e.target.value)}
                  value={selectedFile}
                >
                  {/* {mockFile.map((option, index) => (
                <MenuItem key={index} value={option.fileName}>
                  {option.fileName}
                </MenuItem>
              ))} */}
                  {manualFiles.map((option, index) => (
                    <MenuItem key={index} value={option.fileName}>
                      {option.fileName}
                    </MenuItem>
                  ))}
                </TextField>
                <Box justifyContent={'center'} alignContent={'center'}>
                  <Button
                    role={undefined}
                    variant='contained'
                    tabIndex={-1}
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    {t('downloadButton')}
                  </Button>
                </Box>
              </Box>
            )}

            <AnimatePresence mode='wait'>
              {pdfText && (
                <motion.div
                  key={pdfText}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: pdfText }} // Render processed HTML
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Information from Backend */}
            {/* {parse(htmlStringData ?? '', options)} */}

            <Typography variant='h3' fontWeight={600} gutterBottom>
              {t('readMe.startTitle')}
            </Typography>

            <Typography variant='h5' gutterBottom>
              {t('readMe.startBody')}
            </Typography>
            <Typography variant='h4' fontWeight={600} gutterBottom>
              {t('readMe.guide.title')}
            </Typography>
            <Box display={'flex'} sx={{ fontSize: 22 }}>
              <ul>
                <li>{t('readMe.guide.instructions.list1')}</li>
                <li>{t('readMe.guide.instructions.list2')}</li>
                <li>{t('readMe.guide.instructions.list3')}</li>
                <li>{t('readMe.guide.instructions.list4')}</li>
                <li>{t('readMe.guide.instructions.list5')}</li>
              </ul>
            </Box>
            <Typography variant='h4' fontWeight={600} gutterBottom>
              {t('readMe.features.title')}
            </Typography>
            <Box display={'flex'} sx={{ fontSize: 22 }}>
              <ul>
                <li>{t('readMe.features.instructions.list1')}</li>
                <li>{t('readMe.features.instructions.list2')}</li>
                <li>{t('readMe.features.instructions.list3')}</li>
                <li>{t('readMe.features.instructions.list4')}</li>
                <li>{t('readMe.features.instructions.list5')}</li>
              </ul>
            </Box>
            <Typography variant='h4' fontWeight={600} gutterBottom>
              {t('readMe.support.title')}
            </Typography>

            <Typography variant='h6' gutterBottom>
              {t('readMe.support.helperText')}
              <Typography
                component={'strong'}
                fontWeight={600}
                sx={{
                  color:
                    mode === 'dark'
                      ? theme => theme.palette.warning.light
                      : theme => theme.palette.primary.main,
                }}
              >
                support@sansenshimizu.com
              </Typography>
            </Typography>
          </Container>
        )}
      </Box>
    </PageTransition>
  )
}
