import { useCallback } from 'react'
import { useNotification } from './useNotification'

export default function usePrint() {
  const { notificationSnackbar } = useNotification()
  const printFile = useCallback(
    async (fileUrl: string) => {
      try {
        // Dynamically create a print container if it doesn't exist
        let printContainer = document.getElementById('print-container')
        if (!printContainer) {
          printContainer = document.createElement('div')
          printContainer.id = 'print-container'
          document.body.appendChild(printContainer) // Append to the body
        }

        // Clear any previous content in the print container
        printContainer.innerHTML = ''

        // Dynamically create an image element
        const img = document.createElement('img')
        img.src = fileUrl
        img.style.maxWidth = '100%'

        // Wait for the image to load
        img.onload = () => {
          // console.log('Image loaded successfully.')

          // Append the image to the print container
          printContainer?.appendChild(img)

          // Force the browser to re-render the DOM before printing
          setTimeout(() => {
            window.print()
          }, 100) // Ensure the DOM is updated before calling print
        }

        img.onerror = () => {
          console.error('Error loading image.')
        }
      } catch (error) {
        notificationSnackbar.error(`Error handling print: ${error}`)
      }
    },
    [notificationSnackbar]
  )

  return { printFile } // Return the function to print files
}
