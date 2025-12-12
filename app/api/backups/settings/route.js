import { NextResponse } from 'next/server';

// In a real application, you would store this in a database
let backupSettings = {
  dbHost: 'localhost',
  dbName: 'mydatabase',
  dbUser: 'user',
  dbPassword: 'password',
  backupSchedule: 'daily',
  autoBackups: true,
  storeOnS3: false,
  s3Bucket: '',
  s3Region: '',
  s3AccessKey: '',
  s3SecretKey: '',
  sendByEmail: false,
  recipientEmail: '',
};

export async function GET() {
  return NextResponse.json(backupSettings);
}

export async function POST(request) {
  const newSettings = await request.json();
  backupSettings = { ...backupSettings, ...newSettings };
  return NextResponse.json(backupSettings);
}
