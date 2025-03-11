import { GridColumnVisibilityModel } from '@mui/x-data-grid'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserSettingState {
  column: GridColumnVisibilityModel
  amount: number
}

const initialState: UserSettingState = {
  column: {},
  amount: 3,
}

const userSettingSlice = createSlice({
  name: 'userSetting',
  initialState,
  reducers: {
    setColumnVisibility: (state, action: PayloadAction<GridColumnVisibilityModel>) => {
      const savedSettings = localStorage.getItem('settings')
      const settings = savedSettings ? JSON.parse(savedSettings) : {}
      if (typeof window !== 'undefined') {
        settings.column = { ...action.payload }
        localStorage.setItem('settings', JSON.stringify(settings))
      }
    },
    setAmountSearch: (state, action: PayloadAction<number>) => {
      const savedSettings = localStorage.getItem('settings')
      const settings = savedSettings ? JSON.parse(savedSettings) : {}
      if (typeof window !== 'undefined') {
        settings.amount = action.payload

        localStorage.setItem('settings', JSON.stringify(settings))
      }
    },
  },
})

export const getCurrentColumnVisibility = () => {
  const savedSettings = localStorage.getItem('settings')
  if (savedSettings) {
    const parsedSettings: UserSettingState = JSON.parse(savedSettings)

    return parsedSettings.column
  }
}

export const { setColumnVisibility, setAmountSearch } = userSettingSlice.actions
export default userSettingSlice.reducer
