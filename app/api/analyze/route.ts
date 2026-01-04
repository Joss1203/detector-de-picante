import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const spicyKeywords = [
  "pica",
  "picante",
  "ardor",
  "arde",
  "quema",
  "picazón",
  "picor",
  "capsaicina",
  "chile",
  "jalapeño",
  "habanero",
  "serrano",
  "cayena",
  "tabasco",
  "wasabi",
  "curry",
  "pimienta",
  "mostaza",
  "rábano",
  "jengibre",
]

const questionIndicators = [
  "¿",
  "?",
  "qué",
  "cómo",
  "cuándo",
  "cuánto",
  "por qué",
  "dime si",
  "quiero saber",
  "no sé si",
]

const futureIndicators = ["picará", "va a", "iré", "comeré", "probaré", "mañana", "puede que", "tal vez"]

const pastIndicators = ["picó", "picaba", "comí", "probé", "ayer", "antes", "año pasado"]

const actionIndicators = [
  "me pica",
  "te pica",
  "le pica",
  "nos pica",
  "les pica",
  "siento",
  "me arde",
  "me está",
  "estoy",
  "cuando",
  "al comer",
  "al probar",
  "me picó",
  "me picaron",
  "me pican",
  "me pincha",
  "me pinchan",
  "me espina",
  "me espinan",
  "picó",
  "pica",
  "pican",
  "pincha",
  "pinchan",
  "espina",
  "espinan",

]

const inertObjects = [
  "picahielo",
  "alfiler",
  "aguja",
  "cuchillo",
  "tenedor",
  "un chile",
  "el chile está",
  "hay",
  "tengo",
  "compré",
  "veo",
  "el chile",
  "los chiles",
  "una abeja",
  "un mosquito",
  "una avispa",
  "un erizo",
  "el erizo",
  "erizo"

]

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

function softmax(arr: number[]): number[] {
  const maxVal = Math.max(...arr)
  const exps = arr.map((x) => Math.exp(x - maxVal))
  const sumExps = exps.reduce((a, b) => a + b, 0)
  return exps.map((exp) => exp / sumExps)
}

function extractFeatures(text: string): number[] {
  const lowerText = text.toLowerCase()

  const spicyCount = spicyKeywords.filter((kw) => lowerText.includes(kw)).length
  const isQuestion = questionIndicators.some((ind) => lowerText.includes(ind))
  const isFuture = futureIndicators.some((ind) => lowerText.includes(ind))
  const hasAction = actionIndicators.some((ind) => lowerText.includes(ind))
  const isInert = inertObjects.some((obj) => lowerText.includes(obj))
  const wordCount = text.split(/\s+/).length

  return [spicyCount, isQuestion ? 1 : 0, isFuture ? 1 : 0, hasAction ? 1 : 0, isInert ? 1 : 0, wordCount]
}

function predictWithModel(features: number[]): { prediction: string; confidence: number } {
  try {
    const modelPath = path.join(process.cwd(), "data", "model_weights.json")

    if (fs.existsSync(modelPath)) {
      const modelData = JSON.parse(fs.readFileSync(modelPath, "utf-8"))
      const { W1, b1, W2, b2 } = modelData

      // Forward pass
      const z1 = features.map((_, i) => features.reduce((sum, f, j) => sum + f * W1[j][i], 0) + b1[0][i])
      const a1 = z1.map(sigmoid)
      const z2 = [0, 1].map((i) => a1.reduce((sum, a, j) => sum + a * W2[j][i], 0) + b2[0][i])
      const output = softmax(z2)

      return {
        prediction: output[0] > output[1] ? "pica" : "no_pica",
        confidence: Math.max(...output),
      }
    }
  } catch (error) {
    console.error(" Error loading model:", error)
  }

  const [spicyCount, isQuestion, isFuture, hasAction, isInert] = features

  // Si es pregunta o futuro, NO pica
  if (isQuestion || isFuture) {
    return { prediction: "no_pica", confidence: 0.85 }
  }

  // Si es objeto inerte sin acción, NO pica
  if (isInert && !hasAction) {
    return { prediction: "no_pica", confidence: 0.9 }
  }

  // Si tiene acción/agente y palabras picantes, SÍ pica
  if (hasAction && spicyCount > 0) {
    return { prediction: "pica", confidence: 0.85 }
  }

  // Si tiene palabras picantes pero no es inerte, probablemente pica
  if (spicyCount >= 2) {
    return { prediction: "pica", confidence: 0.75 }
  }

  return { prediction: "no_pica", confidence: 0.7 }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "El texto no puede estar vacío" }, { status: 400 })
    }

    const features = extractFeatures(text)
    const [spicyCount, isQuestion, isFuture, hasAction, isInert] = features

    const { prediction, confidence } = predictWithModel(features)

    let reasoning = ""

    if (isQuestion) {
      reasoning += "Es una pregunta, no afirma que pica. "
    }

    if (isFuture) {
      reasoning += "Está en tiempo futuro, no está picando ahora. "
    }

    if (isInert && !hasAction) {
      reasoning += "Es un objeto inerte sin agente que lo use. "
    }

    if (hasAction) {
      reasoning += "Tiene un agente/acción (alguien experimenta el picar). "
    }

    if (spicyCount > 0) {
      reasoning += `Contiene ${spicyCount} palabra(s) relacionada(s) con picar. `
    }

    if (prediction === "pica") {
      reasoning += "Conclusión: SÍ pica como acción/sensación/gusto."
    } else {
      reasoning += "Conclusión: NO pica."
    }

    return NextResponse.json({
      prediction,
      confidence: Math.round(confidence * 100) / 100,
      analysis: {
        is_question: isQuestion === 1,
        is_future: isFuture === 1,
        has_action: hasAction === 1,
        is_inert_object: isInert === 1,
        spicy_words_count: spicyCount,
        reasoning: reasoning.trim(),
      },
    })
  } catch (error) {
    console.error(" Error in analyze API:", error)
    return NextResponse.json({ error: "Error al analizar el texto" }, { status: 500 })
  }
}
