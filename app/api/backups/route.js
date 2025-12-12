import { NextResponse } from 'next/server';

// In a real application, you would generate and store backups
const backups = [
  {
    id: 1,
    status: 'completed',
    timestamp: new Date().toISOString(),
    type: 'manual',
    s3Url: 'https://example.com/backup1.sql.gz',
    emailSent: true,
  },
  {
    id: 2,
    status: 'failed',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    type: 'automatic',
    s3Url: null,
    emailSent: false,
  },
];

export async function GET() {
  return NextResponse.json(backups);
}

export async function POST() {
  // In a real application, you would trigger a backup process here
  // For now, we'll just simulate it
  const newBackup = {
    id: backups.length + 1,
    status: 'completed',
    timestamp: new Date().toISOString(),
    type: 'manual',
    s3Url: `https://example.com/backup${backups.length + 1}.sql.gz`,
    emailSent: true,
  };
  backups.unshift(newBackup);

  return new NextResponse(null, { status: 204 });
}
