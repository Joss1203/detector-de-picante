"use client"

import type React from "react"
import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Plus, CheckCircle2, Flame, Droplet, Brain } from "lucide-react"

interface TrainingViewProps {
  onTrainingComplete: () => void
}

export function TrainingView({ onTrainingComplete }: TrainingViewProps) {
  const [text, setText] = useState("")
  const [label, setLabel] = useState<"pica" | "no_pica">("pica")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, label }),
      })

      if (response.ok) {
        toast({
          title: "🔥 Ejemplo añadido",
          description: "El ejemplo se guardó para mejorar el modelo.",
        })
        setText("")
        onTrainingComplete()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el ejemplo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRetrain = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/retrain", { method: "POST" })

      if (response.ok) {
        toast({
          title: "🧠 Modelo reentrenado",
          description: "El modelo se actualizó con los nuevos datos.",
        })
        onTrainingComplete()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reentrenar el modelo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">

      {/* ================= AÑADIR EJEMPLO ================= */}
      <Card
        className="
          relative overflow-hidden
          rounded-3xl
          border border-orange-500/20
          bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617]
          shadow-2xl
        "
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        </div>

        <CardHeader className="relative space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30">
              <Plus className="w-6 h-6 text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Añadir Ejemplo
            </CardTitle>
          </div>
          <CardDescription className="text-slate-300">
            Agrega nuevos ejemplos para mejorar el modelo
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TEXTO */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Texto</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ejemplo: Los jalapeños encurtidos..."
                className="
                  h-12
                  rounded-xl
                  bg-[#020617]/80
                  border border-white/10
                  placeholder:text-slate-400
                  focus:ring-2
                  focus:ring-orange-500
                "
              />
            </div>

            {/* CLASIFICACIÓN */}
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">
                Clasificación
              </Label>

              <RadioGroup
                value={label}
                onValueChange={(v) => setLabel(v as "pica" | "no_pica")}
                className="flex gap-6"
              >
                <Label
                  htmlFor="pica"
                  className={`flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 border ${
                    label === "pica"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10"
                  }`}
                >
                  <RadioGroupItem value="pica" id="pica" />
                  <Flame className="w-4 h-4 text-orange-400" />
                  Pica
                </Label>

                <Label
                  htmlFor="no_pica"
                  className={`flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 border ${
                    label === "no_pica"
                      ? "border-sky-500 bg-sky-500/10"
                      : "border-white/10"
                  }`}
                >
                  <RadioGroupItem value="no_pica" id="no_pica" />
                  <Droplet className="w-4 h-4 text-sky-400" />
                  No pica
                </Label>
              </RadioGroup>
            </div>

            {/* BOTÓN */}
            <Button
              type="submit"
              disabled={loading}
              className="
                h-14 w-full
                rounded-full
                bg-gradient-to-r from-orange-500 to-red-500
                text-lg font-bold text-white
                shadow-xl
                hover:scale-105
                hover:shadow-orange-900/40
                transition-all
              "
            >
              {loading ? "Guardando..." : " Agregar Ejemplo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ================= REENTRENAR ================= */}
      <Card
        className="
          relative overflow-hidden
          rounded-3xl
          border border-sky-500/20
          bg-gradient-to-br from-[#020617] via-[#020617]/80 to-[#020617]
          shadow-2xl
        "
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        </div>

        <CardHeader className="relative space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20">
              <Brain className="w-6 h-6 text-sky-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Reentrenar Modelo
            </CardTitle>
          </div>
          <CardDescription className="text-slate-300">
            Actualiza el modelo con los nuevos ejemplos
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Después de agregar varios ejemplos, puedes reentrenar el modelo
            para que aprenda de los nuevos datos y mejore su precisión.
          </p>

          <Button
            onClick={handleRetrain}
            disabled={loading}
            className="
              h-14 w-full
              rounded-full
              bg-gradient-to-r from-sky-400 to-emerald-400
              text-lg font-bold text-black
              shadow-xl
              hover:scale-105
              transition-all
            "
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Reentrenar Ahora
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
