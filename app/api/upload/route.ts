import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file found for upload" }, { status: 400 })
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file format. Please use JPEG, PNG, WebP or GIF formats" },
        { status: 400 },
      )
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds limit (maximum 5MB)" }, { status: 400 })
    }

    // Create a unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get file extension
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads")

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    try {
      await writeFile(join(uploadDir, fileName), buffer)
      console.log("Successfully wrote file:", fileName)
    } catch (writeError: any) {
      console.error("Error writing file:", writeError)
      return NextResponse.json({ error: `Error saving file: ${writeError.message}` }, { status: 500 })
    }

    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json({ imageUrl }, { status: 201 })
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: `Error uploading file: ${error.message}` }, { status: 500 })
  }
}
