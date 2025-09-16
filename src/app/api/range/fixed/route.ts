import { NextResponse } from 'next/server'

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  return NextResponse.json({
    rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
  })
}