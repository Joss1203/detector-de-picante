"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisView } from "@/components/analysis-view"
import { TrainingView } from "@/components/training-view"
import { MetricsView } from "@/components/metrics-view"
import { Flame } from "lucide-react"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTrainingComplete = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary rounded-xl">
            <Flame className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-orange-400 flex items-center gap-2">Detector de Picante</h1>
            <p className="text-slate-400 mt-2">
              Análisis de texto o frase para determinar si algo pica o no
            </p>
          </div>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="  mx-auto
  w-fit
  flex
  justify-center
  gap-2
  rounded-full
  border border-border
  bg-card
  px-2">
    
            <TabsTrigger  value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="training">Entrenamiento</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <AnalysisView key={refreshKey} />
          </TabsContent>



          <TabsContent value="training" className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <TrainingView onTrainingComplete={handleTrainingComplete} />
          </TabsContent>

          <TabsContent value="metrics" className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <MetricsView key={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
