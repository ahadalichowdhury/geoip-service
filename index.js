import { CronJob } from 'cron'
import dotenv from 'dotenv'
import fs from 'fs'
import maxmind from 'maxmind'
import path from 'path'

dotenv.config()

const dbPath = path.join('./GeoLite2-City.mmdb')
let lookup = null

// Initialize the database
async function initializeDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      lookup = await maxmind.open(dbPath)
      console.log('GeoLite2-City database loaded successfully')
    } else {
      console.log('Database file not found. Please run the cron job first to download it.')
    }
  } catch (error) {
    console.error('Error loading database:', error)
  }
}

// IP to Location Function
async function getIpLocation(ip) {
  if (!lookup) {
    throw new Error('Database not loaded. Please ensure GeoLite2-City.mmdb exists.')
  }
  
  const location = lookup.get(ip)
  if (!location) return null

  return {
    ip,
    country: location.country?.names?.en,
    countryCode: location.country?.iso_code,
    region: location.subdivisions?.[0]?.names?.en,
    city: location.city?.names?.en,
    lat: location.location?.latitude,
    lon: location.location?.longitude,
    timezone: location.location?.time_zone,
  }
}

// Start the cron job for database updates
function startCronJob() {
  const job = new CronJob(
    '0 0 3 * * 2', // Every Tuesday at 3:00 AM
    async () => {
      console.log('Running scheduled database update...')
      try {
        // Import and run the update function
        const { downloadAndUpdate } = await import('./cron.js')
        await downloadAndUpdate()
        // Reload the database after update
        await initializeDatabase()
      } catch (error) {
        console.error('Error in scheduled update:', error)
      }
    },
    null,
    true,
    'Asia/Dhaka'
  )
  
  console.log('Weekly GeoLite2 updater scheduled (every Tuesday 3 AM Dhaka time)')
  return job
}

// Example usage function
async function exampleUsage() {
  try {
    const testIps = [
      '103.218.26.249',
      '8.8.8.8',
      '1.1.1.1'
    ]
    
    for (const ip of testIps) {
      const location = await getIpLocation(ip)
      console.log(`Location for ${ip}:`, location)
    }
  } catch (error) {
    console.error('Error in example usage:', error)
  }
}

// Main function
async function main() {
  console.log('Starting Geeo Geolocation Service...')
  
  // Initialize database
  await initializeDatabase()
  
  // Start cron job for automatic updates
  startCronJob()
  
  // Run example usage
  await exampleUsage()
  
  console.log('Service is running. Cron job is active for database updates.')
}

// Export functions for external use
export { getIpLocation, initializeDatabase, startCronJob }

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
