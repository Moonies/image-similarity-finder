import { RoleDetail } from '@/api/role/getRoleList'
import { Box, MenuItem, TextField, TextFieldProps, Typography, useTheme } from '@mui/material'
import React from 'react'

interface TextBox<T = RoleDetail> {
  text: string
  list?: T[]
  lasted?: boolean
}

type TextFieldBoxProps<T = RoleDetail> = TextBox<T> & Omit<TextFieldProps, keyof TextBox>

const TextFieldBox: React.FC<TextFieldBoxProps> = ({
  text = '',
  size = 'small',
  color: colorProps,
  lasted = false,
  list,
  ...props
}) => {
  const theme = useTheme()
  const color = colorProps ? colorProps : theme.palette.info.light
  return (
    <Box display={'flex'} alignItems={'center'} gap={4} marginBottom={lasted ? 0 : 2}>
      <Typography sx={{ width: '40%' }} color={color}>
        {text}
      </Typography>
      {list ? (
        <TextField id='outlined-select-currency' {...props} size='small' fullWidth>
          {list.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField {...props} variant='outlined' size='small' fullWidth />
      )}
    </Box>
  )
}
export default TextFieldBox
