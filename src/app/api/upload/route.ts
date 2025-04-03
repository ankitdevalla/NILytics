import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parse } from 'csv-parse/sync'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read file content
    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString('utf-8')

    let records: any[]
    if (file.name.endsWith('.csv')) {
      records = parse(content, {
        columns: true,
        skip_empty_lines: true,
      })
    } else if (file.name.endsWith('.json')) {
      records = JSON.parse(content)
    } else {
      return NextResponse.json(
        { error: 'Invalid file format' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = [
      'payment_id',
      'athlete_id',
      'athlete_name',
      'sport',
      'gender',
      'activity_type',
      'amount',
      'date',
      'source'
    ]

    const invalidRecords = records.filter(record => 
      !requiredFields.every(field => record[field])
    )

    if (invalidRecords.length > 0) {
      return NextResponse.json(
        { 
          error: 'Invalid records found',
          details: invalidRecords
        },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = await createClient()

    // Process records in batches
    const batchSize = 100
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('payments')
        .upsert(
          batch.map(record => ({
            id: record.payment_id,
            athlete_id: record.athlete_id,
            amount: parseFloat(record.amount),
            date: new Date(record.date).toISOString(),
            activity_type: record.activity_type,
            source: record.source
          }))
        )

      if (error) {
        console.error('Error inserting batch:', error)
        return NextResponse.json(
          { error: 'Failed to process records' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { message: 'File processed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}