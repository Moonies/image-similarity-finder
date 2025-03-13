const fs = require('fs')
const os = require('os')

// Function to get the local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address // Return the first non-internal IPv4 address
      }
    }
  }
  return '127.0.0.1' // Fallback to localhost if no IP is found
}

// Fetch the local IP
const localIP = getLocalIP()

// Set a default port or allow it to be set dynamically
const port = 8081 // Default to 3000 if no PORT is provided

// Define the content of the .env.production file
const envContent = `NEXT_PUBLIC_API_URL=http://${localIP}:${port}`

// Write the content to .env.production
fs.writeFileSync('.env.production', envContent, 'utf8')

console.log('.env.production file has been created with LOCAL_IP:', localIP, 'and PORT:', port)
