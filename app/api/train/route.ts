import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  try {
    const { text, label } = await request.json()

    const dataDir = path.join(process.cwd(), "data")
    const csvPath = path.join(dataDir, "training_data.csv")

    // Crear directorio si no existe
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Leer archivo existente o crear cabecera
    let csvContent = ""
    try {
      csvContent = await fs.readFile(csvPath, "utf-8")
    } catch {
      csvContent = "text,label\n"
    }

    // Agregar nueva línea (escapar comillas)
    const escapedText = text.replace(/"/g, '""')
    csvContent += `"${escapedText}",${label}\n`

    await fs.writeFile(csvPath, csvContent, "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(" Error saving training data:", error)
    return NextResponse.json({ error: "Error al guardar los datos" }, { status: 500 })
  }
}
