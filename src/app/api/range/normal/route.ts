import { NextResponse } from 'next/server'

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  return NextResponse.json({
    min: 1,
    max: 100,
  })
}