# 🌍 Geeo - Geolocation Service

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![npm](https://img.shields.io/badge/npm-v1.0.0-orange.svg)](https://www.npmjs.com/)

A powerful Node.js geolocation service that automatically updates the MaxMind GeoLite2 database and provides accurate IP-to-location lookup functionality with continuous background updates.

## ✨ Features

- 🔄 **Automatic Database Updates** - Weekly cron job updates GeoLite2-City database
- 🌐 **IP Geolocation** - Accurate location lookup for any IP address
- ⚡ **High Performance** - Fast in-memory database queries
- 🔧 **Easy Integration** - Simple API for your applications
- 🕒 **Continuous Service** - Background updates without downtime
- 📊 **Rich Location Data** - Country, region, city, coordinates, and timezone

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MaxMind GeoLite2 account (free)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ahadalichowdhury/geoip-service.git
   cd geeo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Get MaxMind credentials:**

   - Sign up at [MaxMind GeoLite2](https://www.maxmind.com/en/geolite2/signup) (free)
   - Get your Account ID and License Key from your account dashboard

4. **Set up environment variables:**

   ```bash
   # Create .env file
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:

   ```env
   MAXMIND_ACCOUNT_ID=your_account_id_here
   MAXMIND_LICENSE_KEY=your_license_key_here
   ```

5. **Download the database:**

   ```bash
   npm run cron
   ```

6. **Start the service:**
   ```bash
   npm start
   ```

## 📖 Usage

### Basic Usage

```javascript
import { getIpLocation, initializeDatabase } from "./index.js";

// Initialize the database
await initializeDatabase();

// Look up an IP address
const location = await getIpLocation("8.8.8.8");
console.log(location);
```

### Example Output

```javascript
{
  ip: "8.8.8.8",
  country: "United States",
  countryCode: "US",
  region: "California",
  city: "Mountain View",
  lat: 37.4056,
  lon: -122.0775,
  timezone: "America/Los_Angeles"
}
```

### Running Examples

```bash
# Run the example file
node example.js

# Start the full service with cron
npm start

# Manual database update
npm run cron
```

## 🔧 API Reference

### `getIpLocation(ip)`

Returns detailed location information for an IP address.

**Parameters:**

- `ip` (string) - IP address to lookup (IPv4 or IPv6)

**Returns:** Object with location data or `null` if not found

**Example:**

```javascript
const location = await getIpLocation("1.1.1.1");
```

### `initializeDatabase()`

Loads the GeoLite2-City database into memory. Must be called before using `getIpLocation()`.

**Example:**

```javascript
await initializeDatabase();
```

### `startCronJob()`

Starts the automatic weekly database update cron job.

**Example:**

```javascript
startCronJob(); // Runs every Tuesday at 3:00 AM (Dhaka time)
```

## ⏰ Cron Schedule

The database is automatically updated every **Tuesday at 3:00 AM** (Asia/Dhaka timezone).

You can modify the schedule in `index.js`:

```javascript
const job = new CronJob(
  "0 0 3 * * 2" // Cron expression: Every Tuesday at 3 AM
  // ... rest of the code
);
```

## 📁 Project Structure

```
geeo/
├── index.js          # Main service file with API functions
├── cron.js           # Database update functionality
├── example.js        # Usage examples
├── package.json      # Dependencies and scripts
├── README.md         # This file
├── .env.example      # Environment variables template
└── GeoLite2-City.mmdb # MaxMind database (downloaded)
```

## 🛠️ Scripts

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm start`       | Start the geolocation service with cron |
| `npm run cron`    | Manually update the database            |
| `npm run dev`     | Development mode                        |
| `node example.js` | Run usage examples                      |

## 📦 Dependencies

- **maxmind** - MaxMind GeoIP database reader
- **cron** - Cron job scheduling
- **node-fetch** - HTTP requests for database downloads
- **dotenv** - Environment variable management

## 🔍 Troubleshooting

### Common Issues

**1. Database not found error:**

```bash
# Download the database first
npm run cron
```

**2. MaxMind credentials error:**

- Ensure your `.env` file has correct credentials
- Verify your MaxMind account is active

**3. Permission denied on database file:**

```bash
# Check file permissions
ls -la GeoLite2-City.mmdb
```

### Error Messages

- `"Database not loaded"` → Run `npm run cron` first
- `"Failed to download"` → Check your MaxMind credentials
- `"Location not found"` → IP address not in database

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MaxMind](https://www.maxmind.com/) for providing the GeoLite2 database
- [Node.js](https://nodejs.org/) community for excellent tooling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting](#troubleshooting) section
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

---

⭐ **Star this repository if you find it helpful!**
