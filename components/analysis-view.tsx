"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Flame, Droplet, AlertCircle } from "lucide-react"

interface AnalysisResult {
  prediction: "pica" | "no_pica"
  confidence: number
  analysis: {
    is_question: boolean
    is_future: boolean
    is_past: boolean
    is_present: boolean
    reasoning: string
  }
}

export function AnalysisView() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeText = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error analyzing text:", error)
    } finally {
      setLoading(false)
    }
  }

  const picaPct = result
    ? result.prediction === "pica"
      ? result.confidence * 100
      : (1 - result.confidence) * 100
    : 0

  const noPicaPct = result ? 100 - picaPct : 0

  return (
    <div className="space-y-10">

      {/* ================= ANALISIS ================= */}
      <Card
        className="
          relative overflow-hidden
          rounded-[2rem]
          border border-white/10
          bg-gradient-to-br
          from-[#0f172a]
          via-[#111827]
          to-[#020617]
          shadow-2xl
        "
      >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute top-1/2 -right-24 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        </div>

        <CardHeader className="relative space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30">
              <Flame className="w-7 h-7 text-orange-400" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Analizar Texto
            </CardTitle>
          </div>
          <CardDescription className="text-slate-300 text-base max-w-xl">
            Ingresa un texto para determinar si algo pica o no
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6">
          <Textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ejemplo: El chile habanero es muy picante..."
            className="
              resize-none
              rounded-2xl
              bg-[#020617]/80
              border border-white/10
              text-lg
              placeholder:text-slate-400
              shadow-inner
              focus:ring-2
              focus:ring-orange-500
              focus:border-orange-500
              transition
            "
          />

          {/* BOTÓN OVALADO */}
          <div className="relative mt-10 flex justify-center">
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <div className="h-20 w-64 rounded-full bg-gradient-to-r from-orange-500/30 to-red-500/30 blur-xl" />
            </div>

            <Button
              onClick={analyzeText}
              disabled={loading || !text.trim()}
              className="
                relative z-10
                h-16 w-56
                rounded-full
                bg-gradient-to-r from-orange-500 to-red-500
                text-lg font-bold text-white
                shadow-xl
                hover:scale-105
                hover:shadow-orange-500/40
                active:scale-95
                transition-all
              "
            >
              {loading ? "Analizando..." : " Analizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================= RESULTADO ================= */}
      {result && (
        <Card
          className="
            rounded-3xl
            border border-white/10
            bg-gradient-to-br from-red-500/10 to-orange-500/10
            shadow-2xl
          "
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">Resultado</CardTitle>
              <Badge
                variant={result.prediction === "pica" ? "destructive" : "secondary"}
                className="px-4 py-2 text-lg font-bold"
              >
                {result.prediction === "pica" ? "🔥 PICA" : "💧 NO PICA"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">

            {/* ===== BARRAS COMPARATIVAS ===== */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>🔥 Probabilidad PICA</span>
                  <span className="font-semibold">{picaPct.toFixed(1)}%</span>
                </div>
                <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700"
                    style={{ width: `${picaPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>💧 Probabilidad NO PICA</span>
                  <span className="font-semibold">{noPicaPct.toFixed(1)}%</span>
                </div>
                <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-700"
                    style={{ width: `${noPicaPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ===== MEDIDOR DE INTENSIDAD ===== */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Intensidad de picante
              </div>
              <div className="relative h-3 rounded-full bg-white/10">
                <div
                  className="
                    absolute left-0 top-0 h-3 rounded-full
                    bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600
                    transition-all duration-700
                  "
                  style={{ width: `${picaPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Suave</span>
                <span>Medio</span>
                <span>Extremo</span>
              </div>
            </div>

            {/* ===== RAZONAMIENTO ===== */}
            <Alert className="rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="leading-relaxed">
                {result.analysis.reasoning}
              </AlertDescription>
            </Alert>

            {/* ===== PANEL ANALÍTICO ===== */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  Tipo de frase
                </div>
                <div className="font-semibold">
                  {result.analysis.is_question ? "Pregunta" : "Afirmación"}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  Tiempo verbal
                </div>
                <div className="font-semibold">
                  {result.analysis.is_present
                    ? "Presente"
                    : result.analysis.is_past
                    ? "Pasado"
                    : "Futuro"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
