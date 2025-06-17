import { getIpLocation, initializeDatabase } from './index.js'

async function example() {
  console.log('Geeo Geolocation Service Example')
  console.log('================================')
  
  try {
    // Initialize the database
    await initializeDatabase()
    
    // Test IP addresses
    const testIps = [
      '103.218.26.249',  // Your original test IP
      '8.8.8.8',         // Google DNS
      '1.1.1.1',         // Cloudflare DNS
      '208.67.222.222'   // OpenDNS
    ]
    
    for (const ip of testIps) {
      console.log(`\nLooking up: ${ip}`)
      const location = await getIpLocation(ip)
      
      if (location) {
        console.log('📍 Location found:')
        console.log(`   Country: ${location.country} (${location.countryCode})`)
        console.log(`   Region: ${location.region}`)
        console.log(`   City: ${location.city}`)
        console.log(`   Coordinates: ${location.lat}, ${location.lon}`)
        console.log(`   Timezone: ${location.timezone}`)
      } else {
        console.log('❌ Location not found')
      }
    }
    
    const location = await getIpLocation('8.8.8.8')
    
  } catch (error) {
    console.error('Error:', error.message)
    console.log('\nMake sure you have:')
    console.log('1. Created a .env file with your MaxMind credentials')
    console.log('2. Downloaded the database using: npm run cron')
  }
}

example() 