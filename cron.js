import dotenv from 'dotenv'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
dotenv.config()

// Your MaxMind credentials here:
const ACCOUNT_ID = process.env.MAXMIND_ACCOUNT_ID
const LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY

// Download URL with edition_id=GeoLite2-City and tar.gz suffix
const DOWNLOAD_URL = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${LICENSE_KEY}&account_id=${ACCOUNT_ID}&suffix=tar.gz`

// Local paths
const DOWNLOAD_PATH = path.resolve('./GeoLite2-City.tar.gz')
const EXTRACT_DIR = path.resolve('./GeoLite2-Extracted')
const TARGET_DB_PATH = path.resolve('./GeoLite2-City.mmdb')

export async function downloadAndUpdate() {
  console.log(`[${new Date().toISOString()}] Starting GeoLite2-City update...`)

  try {
    // Download .tar.gz
    const res = await fetch(DOWNLOAD_URL)
    if (!res.ok) {
      throw new Error(`Failed to download: ${res.status} ${res.statusText}`)
    }
    const fileStream = fs.createWriteStream(DOWNLOAD_PATH)
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream)
      res.body.on('error', reject)
      fileStream.on('finish', resolve)
    })
    console.log('Download complete.')

    // Extract tar.gz
    // Using built-in 'child_process' and 'tar' cli (Linux/macOS). For Windows, install tar or use a library.
    const { exec } = await import('child_process')
    await new Promise((resolve, reject) => {
      exec(
        `mkdir -p ${EXTRACT_DIR} && tar -xzf ${DOWNLOAD_PATH} -C ${EXTRACT_DIR}`,
        (err, stdout, stderr) => {
          if (err) return reject(err)
          resolve()
        }
      )
    })
    console.log('Extraction complete.')

    // Find the .mmdb file inside extracted folder
    const files = fs.readdirSync(EXTRACT_DIR)
    const folderName = files.find((f) => f.startsWith('GeoLite2-City'))
    if (!folderName) throw new Error('Extracted folder not found')
    const mmdbPath = path.join(EXTRACT_DIR, folderName, 'GeoLite2-City.mmdb')
    if (!fs.existsSync(mmdbPath))
      throw new Error('.mmdb file not found in extracted folder')

    // Replace old mmdb
    fs.copyFileSync(mmdbPath, TARGET_DB_PATH)
    console.log(`GeoLite2-City.mmdb updated at ${TARGET_DB_PATH}`)

    // Cleanup downloaded and extracted files (optional)
    fs.unlinkSync(DOWNLOAD_PATH)
    fs.rmSync(EXTRACT_DIR, { recursive: true, force: true })

    console.log('Cleanup complete.')
    return true
  } catch (error) {
    console.error('Error updating GeoLite2-City:', error)
    return false
  }
}

// If this file is run directly, execute the update
if (import.meta.url === `file://${process.argv[1]}`) {
  downloadAndUpdate().then(success => {
    if (success) {
      console.log('Database update completed successfully')
    } else {
      console.log('Database update failed')
      process.exit(1)
    }
  })
}
