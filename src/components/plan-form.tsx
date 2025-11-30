"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Plan } from "@/types"
import type { PlanCreationData } from "@/service/planes-service"
import { Trash2, Plus } from "lucide-react"

interface PlanFormProps {
  initialData?: Plan
  onSubmit: (data: PlanCreationData, files: File[]) => Promise<void>
  isLoading?: boolean
  isEditMode?: boolean
}

interface FormData {
  nombre: string
  descripcion: string
  precioValor: number
  precioMoneda: "COP" | "USD"
  duracion: number
  cupoMaximo: number
  fechasDisponibles: Array<{ desde: string; hasta: string }>
}

export default function PlanForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditMode = false,
}: PlanFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: initialData?.nombre || "",
    descripcion: initialData?.descripcion || "",
    precioValor: initialData?.precioValor || 0,
    precioMoneda: initialData?.precioMoneda || "COP",
    duracion: initialData?.duracion || 0,
    cupoMaximo: initialData?.cupoMaximo || 1,
    fechasDisponibles: initialData?.fechasDisponibles || [
      { desde: "", hasta: "" },
    ],
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "precioValor" || name === "duracion" || name === "cupoMaximo"
          ? parseFloat(value) || 0
          : value,
    }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      precioMoneda: value as "COP" | "USD",
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length + selectedFiles.length > 3) {
      toast.error("Máximo 3 imágenes permitidas")
      return
    }

    // Validar tipos de archivo
    const validTypes = ["image/jpeg", "image/png"]
    const invalidFiles = files.filter((f) => !validTypes.includes(f.type))

    if (invalidFiles.length > 0) {
      toast.error("Solo se permiten archivos JPG y PNG")
      return
    }

    setSelectedFiles((prev) => [...prev, ...files])

    // Crear previsualizaciones
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDateChange = (
    index: number,
    field: "desde" | "hasta",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      fechasDisponibles: prev.fechasDisponibles.map((fecha, i) =>
        i === index ? { ...fecha, [field]: value } : fecha
      ),
    }))
  }

  const addDateRange = () => {
    setFormData((prev) => ({
      ...prev,
      fechasDisponibles: [...prev.fechasDisponibles, { desde: "", hasta: "" }],
    }))
  }

  const removeDateRange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fechasDisponibles: prev.fechasDisponibles.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.nombre.length < 10 || formData.nombre.length > 1000) {
      newErrors.nombre = "El nombre debe tener entre 10 y 1000 caracteres"
    }

    if (
      formData.descripcion.length < 10 ||
      formData.descripcion.length > 5000
    ) {
      newErrors.descripcion =
        "La descripción debe tener entre 10 y 5000 caracteres"
    }

    if (formData.precioValor <= 0) {
      newErrors.precioValor = "El precio debe ser mayor a 0"
    }

    if (formData.duracion <= 0) {
      newErrors.duracion = "La duración debe ser mayor a 0"
    }

    if (formData.cupoMaximo < 1 || formData.cupoMaximo > 12) {
      newErrors.cupoMaximo = "El cupo debe estar entre 1 y 12"
    }

    if (!isEditMode && selectedFiles.length === 0) {
      newErrors.imagenes = "Debes subir al menos 1 imagen"
    }

    if (selectedFiles.length > 3) {
      newErrors.imagenes = "Máximo 3 imágenes permitidas"
    }

    if (formData.fechasDisponibles.length === 0) {
      newErrors.fechas = "Debes agregar al menos 1 rango de fechas"
    }

    formData.fechasDisponibles.forEach((fecha, i) => {
      if (!fecha.desde || !fecha.hasta) {
        newErrors[`fecha_${i}`] = "Completa ambas fechas"
      } else if (new Date(fecha.desde) >= new Date(fecha.hasta)) {
        newErrors[`fecha_${i}`] = "La fecha de inicio debe ser anterior a la final"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor completa correctamente el formulario")
      return
    }

    try {
      const data: PlanCreationData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: {
          valor: formData.precioValor,
          moneda: formData.precioMoneda,
        },
        duracion: formData.duracion,
        cupoMaximo: formData.cupoMaximo,
        fechasDisponibles: formData.fechasDisponibles,
      }

      await onSubmit(data, selectedFiles)
    } catch (error) {
      console.error("Error en formulario:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Plan *</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Tour de Cascadas"
              className={errors.nombre ? "border-red-500" : ""}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {formData.nombre.length}/1000 caracteres
            </p>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción *</Label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el plan en detalle..."
              className={`w-full px-3 py-2 border rounded-md min-h-32 ${
                errors.descripcion ? "border-red-500" : ""
              }`}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {formData.descripcion.length}/5000 caracteres
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Precio y Duración */}
      <Card>
        <CardHeader>
          <CardTitle>Precio y Duración</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="precioValor">Precio *</Label>
            <Input
              id="precioValor"
              name="precioValor"
              type="number"
              value={formData.precioValor}
              onChange={handleInputChange}
              placeholder="0"
              className={errors.precioValor ? "border-red-500" : ""}
            />
            {errors.precioValor && (
              <p className="text-sm text-red-500 mt-1">{errors.precioValor}</p>
            )}
          </div>

          <div>
            <Label htmlFor="precioMoneda">Moneda *</Label>
            <Select value={formData.precioMoneda} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COP">COP (Pesos Colombianos)</SelectItem>
                <SelectItem value="USD">USD (Dólares)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duracion">Duración (horas) *</Label>
            <Input
              id="duracion"
              name="duracion"
              type="number"
              value={formData.duracion}
              onChange={handleInputChange}
              placeholder="0"
              className={errors.duracion ? "border-red-500" : ""}
            />
            {errors.duracion && (
              <p className="text-sm text-red-500 mt-1">{errors.duracion}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cupoMaximo">Cupo Máximo (1-12) *</Label>
            <Input
              id="cupoMaximo"
              name="cupoMaximo"
              type="number"
              min="1"
              max="12"
              value={formData.cupoMaximo}
              onChange={handleInputChange}
              placeholder="0"
              className={errors.cupoMaximo ? "border-red-500" : ""}
            />
            {errors.cupoMaximo && (
              <p className="text-sm text-red-500 mt-1">{errors.cupoMaximo}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fechas Disponibles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fechas Disponibles</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDateRange}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Rango
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.fechas && (
            <p className="text-sm text-red-500">{errors.fechas}</p>
          )}

          {formData.fechasDisponibles.map((fecha, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor={`desde_${index}`}>Desde</Label>
                <Input
                  id={`desde_${index}`}
                  type="datetime-local"
                  value={fecha.desde}
                  onChange={(e) =>
                    handleDateChange(index, "desde", e.target.value)
                  }
                  className={
                    errors[`fecha_${index}`] ? "border-red-500" : ""
                  }
                />
              </div>

              <div className="flex-1">
                <Label htmlFor={`hasta_${index}`}>Hasta</Label>
                <Input
                  id={`hasta_${index}`}
                  type="datetime-local"
                  value={fecha.hasta}
                  onChange={(e) =>
                    handleDateChange(index, "hasta", e.target.value)
                  }
                  className={
                    errors[`fecha_${index}`] ? "border-red-500" : ""
                  }
                />
              </div>

              {formData.fechasDisponibles.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeDateRange(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          {errors.fechas && (
            <p className="text-sm text-red-500">{errors.fechas}</p>
          )}
        </CardContent>
      </Card>

      {/* Imágenes - Solo en modo crear */}
      {!isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Imágenes ({selectedFiles.length}/3)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                disabled={selectedFiles.length >= 3}
                className="hidden"
                id="file-input"
              />
              <Label
                htmlFor="file-input"
                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                Arrastra imágenes aquí o haz clic para seleccionar
                <br />
                <span className="text-xs">JPG o PNG, máx 100MB c/u</span>
              </Label>
            </div>

            {errors.imagenes && (
              <p className="text-sm text-red-500">{errors.imagenes}</p>
            )}

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Imágenes Actuales - Solo en modo editar */}
      {isEditMode && initialData?.imagenes && initialData.imagenes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imágenes Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {initialData.imagenes.map((imagePath, index) => {
                const baseUrl =
                  process.env.NEXT_PUBLIC_PLAN_MICRO_URL ||
                  "http://localhost:3002/api/v1"
                const domainUrl = baseUrl.replace(/\/api\/v1$/, "")
                const imageUrl = imagePath.startsWith("http")
                  ? imagePath
                  : `${domainUrl}${imagePath}`

                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Plan ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Las imágenes no se pueden cambiar en modo edición
            </p>
          </CardContent>
        </Card>
      )}

      {/* Botones */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : isEditMode ? "Guardar Cambios" : "Crear Plan"}
        </Button>
      </div>
    </form>
  )
}
