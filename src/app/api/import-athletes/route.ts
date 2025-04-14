import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import { Sport } from "@/lib/supabase";

// Create a Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface AthleteRecord {
  name: string;
  year: string;
  sport: string;
  gender: string;
}

export async function POST(request: Request) {
  try {
    console.log("Starting athlete import process...");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const sportsJson = formData.get("sports") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!sportsJson) {
      return NextResponse.json(
        { error: "No sports data provided" },
        { status: 400 }
      );
    }

    // Parse the sports data
    const existingSports = JSON.parse(sportsJson) as Sport[];
    console.log("Using sports from frontend:", existingSports);

    // Read file content
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString("utf-8");

    // Parse CSV content with specific options
    console.log("Parsing CSV...");
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      skipRecordsWithError: true,
    }) as AthleteRecord[];

    console.log("Total records to process:", records.length);

    // Create a map of sport names to IDs
    const sportMap = new Map<string, string>();
    existingSports.forEach((sport: Sport) => {
      sportMap.set(sport.name, sport.id);
    });

    const results = {
      total: records.length,
      success: 0,
      errors: [] as any[],
      debug: {
        existingSports: existingSports.map((s: Sport) => ({
          name: s.name,
          id: s.id,
          nameLength: s.name.length,
          nameChars: Array.from(s.name).map((c: string) => c.charCodeAt(0)),
        })),
        uniqueSportsInCsv: [...new Set(records.map((r) => r.sport.trim()))].map(
          (s: string) => ({
            name: s,
            length: s.length,
            chars: Array.from(s).map((c: string) => c.charCodeAt(0)),
          })
        ),
        sportMapEntries: Array.from(sportMap.entries()).map(([name, id]) => ({
          name,
          id,
        })),
      },
    };

    // Process each record individually
    for (const record of records) {
      try {
        const sportName = record.sport.trim();
        const sportId = sportMap.get(sportName);

        if (!sportId) {
          results.errors.push({
            type: "sport_not_found",
            sport: sportName,
            sportDetails: {
              length: sportName.length,
              chars: Array.from(sportName).map((c) => c.charCodeAt(0)),
              availableSports: existingSports.map((s) => s.name),
            },
            error: `Sport "${sportName}" not found in the database`,
          });
          continue;
        }

        // Insert athlete directly using the server-side client
        const { error: insertError } = await supabase.from("athletes").insert([
          {
            name: record.name.trim(),
            year: record.year.trim(),
            gender: record.gender.trim(),
            sport_id: sportId,
          },
        ]);

        if (insertError) {
          console.error("Error inserting athlete:", insertError);
          results.errors.push({
            type: "athlete_creation",
            error: insertError.message,
            details: record,
          });
        } else {
          results.success += 1;
        }
      } catch (error) {
        console.error("Error creating athlete:", error);
        results.errors.push({
          type: "athlete_creation",
          error: error instanceof Error ? error.message : "Unknown error",
          details: record,
        });
      }
    }

    return NextResponse.json({
      message: "Import completed",
      results,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
