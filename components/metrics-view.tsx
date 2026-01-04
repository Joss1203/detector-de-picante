"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, Target, Database } from "lucide-react"


  
interface Metrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  total_samples: number
  class_distribution: {
    pica: number
    no_pica: number
  }
}

export function MetricsView() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics")
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Cargando métricas…</div>
  }

  if (!metrics) {
    return <div className="text-center py-12 text-muted-foreground">No hay métricas disponibles</div>
  }

  const chartData = [
    {
      name: "Pica",
      value: metrics.class_distribution.pica,
      fill: "url(#picaGradient)",
    },
    {
      name: "No Pica",
      value: metrics.class_distribution.no_pica,
      fill: "url(#noPicaGradient)",
    },
  ]

  return (
    <div className="space-y-10">

      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Exactitud */}
        <Card className="rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exactitud</CardTitle>
            <Target className="h-5 w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-400">
              {(metrics.accuracy * 100).toFixed(1)}%
            </div>
            <Progress
              value={metrics.accuracy * 100}
              className="mt-3 [&>div]:bg-gradient-to-r [&>div]:from-orange-400 [&>div]:to-red-500"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Precisión general del modelo
            </p>
          </CardContent>
        </Card>

        {/* F1 */}
        <Card className="rounded-3xl bg-gradient-to-br from-sky-500/10 to-emerald-500/10 border border-sky-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">F1-Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-sky-400">
              {(metrics.f1_score * 100).toFixed(1)}%
            </div>
            <Progress
              value={metrics.f1_score * 100}
              className="mt-3 [&>div]:bg-gradient-to-r [&>div]:from-sky-400 [&>div]:to-emerald-400"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Balance entre precisión y recall
            </p>
          </CardContent>
        </Card>

        {/* Muestras */}
        <Card className="rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Muestras</CardTitle>
            <Database className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-400">
              {metrics.total_samples}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total de datos de entrenamiento
            </p>
          </CardContent>
        </Card>
      </div>

      {
      <div className="grid gap-8 md:grid-cols-2">

        {/* Métricas detalladas */}
        <Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#020617] to-[#020617]/60 shadow-xl">
          <CardHeader>
            <CardTitle>Métricas Detalladas</CardTitle>
            <CardDescription>
              Rendimiento del modelo por métrica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Precisión", value: metrics.precision, color: "from-orange-400 to-red-500" },
              { label: "Recall", value: metrics.recall, color: "from-sky-400 to-emerald-400" },
              { label: "Exactitud", value: metrics.accuracy, color: "from-purple-400 to-indigo-500" },
            ].map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold">{(m.value * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={m.value * 100}
                  className={`[&>div]:bg-gradient-to-r [&>div]:${m.color}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        
        
      </div> }
    </div>
  )
}
