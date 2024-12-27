import React, { useState } from 'react'

type MockRecord = {
  drawingNumber: string
  orderNumber: string
  name: string
  materialCost: number
  materialSup: string
  latheCost: number
  latheSup: string
  millingCost: number
  millingSup: string
  heatTreatmentCost: number
  heatTreatmentSup: string
  grindingCost: number
  grindingSup: string
  transportationCost: number
  transportationSup: string
  generalCost: number
  generalSup: string
  weldingCost: number
  weldingSup: string
  otherCost: number
  otherSup: string
  sellingPrice: number
  defectDetails: string
}
export default function useEditRecord() {
  const [recordData, setRecordData] = useState<Partial<MockRecord>>()
  const handleChange = (name: keyof MockRecord, value: string | number | null) => {
    setRecordData(prev => ({ ...prev, [name]: value }))
  }
  return { handleChange, recordData }
}
