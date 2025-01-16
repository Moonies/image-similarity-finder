import { Box, TextField, TextFieldProps, Typography, useTheme } from '@mui/material'
import React from 'react'

interface TextBox {
  text: string
  lasted?: boolean
}

type TextFieldBoxProps = TextBox & Omit<TextFieldProps, keyof TextBox>

const TextFieldBox: React.FC<TextFieldBoxProps> = ({
  text = '',
  size = 'small',
  color: colorProps,
  lasted = false,
  ...props
}) => {
  const theme = useTheme()
  const color = colorProps ? colorProps : theme.palette.info.light
  return (
    <Box display={'flex'} alignItems={'center'} gap={4} marginBottom={lasted ? 0 : 2}>
      <Typography sx={{ width: '40%' }} color={color}>
        {text}
      </Typography>
      <TextField {...props} variant='outlined' size='small' fullWidth />
    </Box>
  )
}
export default TextFieldBox
