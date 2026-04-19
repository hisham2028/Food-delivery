import mongoose from 'mongoose';
import 'dotenv/config';

console.log('Testing MongoDB Connection...');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password

const testConnection = async () => {
  try {
    console.log('\nAttempting to connect...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n🔧 IP WHITELIST ISSUE:');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Network Access → Add IP Address → 0.0.0.0/0');
      console.log('3. Wait 2-3 minutes');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 AUTHENTICATION ISSUE:');
      console.log('Check your username and password in .env');
    }
    
    process.exit(1);
  }
};

testConnection();