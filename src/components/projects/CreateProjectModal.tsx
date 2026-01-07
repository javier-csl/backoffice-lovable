import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CalendarIcon, 
  Upload, 
  X, 
  Plus, 
  Trash2,
  Image,
  GripVertical,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface Tipologia {
  id: string;
  tipo: string;
  superficieUtil: number;
  superficieTotal: number;
  ufReferencia: number;
  disponibilidad: number;
}

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INMOBILIARIAS = [
  { id: '1', name: 'Inmobiliaria Almagro' },
  { id: '2', name: 'Paz Corp' },
  { id: '3', name: 'Socovesa' },
  { id: '4', name: 'Echeverría Izquierdo' },
];

const COMUNAS = [
  'Las Condes', 'Providencia', 'Vitacura', 'Ñuñoa', 'La Reina',
  'Lo Barnechea', 'Santiago Centro', 'Viña del Mar', 'Concón',
];

const TIPOLOGIAS_OPTIONS = [
  '1D1B', '1D2B', '2D1B', '2D2B', '3D2B', '3D3B', '4D3B', 'Estudio',
];

const ESTADOS_PROYECTO = [
  { value: 'activo', label: 'Activo' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'invisible', label: 'Invisible para screening' },
];

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Form state
  const [nombre, setNombre] = useState('');
  const [inmobiliariaId, setInmobiliariaId] = useState('');
  const [comuna, setComuna] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('activo');
  const [fechaEntrega, setFechaEntrega] = useState<Date>();
  const [ufDesde, setUfDesde] = useState('');
  const [ufHasta, setUfHasta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipologias, setTipologias] = useState<Tipologia[]>([
    { id: '1', tipo: '', superficieUtil: 0, superficieTotal: 0, ufReferencia: 0, disponibilidad: 0 }
  ]);
  const [imagenPrincipal, setImagenPrincipal] = useState<string | null>(null);
  const [galeria, setGaleria] = useState<string[]>([]);
  const [planos, setPlanos] = useState<string[]>([]);
  const [esIntegracion, setEsIntegracion] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTipologia = () => {
    setTipologias([
      ...tipologias,
      { id: Date.now().toString(), tipo: '', superficieUtil: 0, superficieTotal: 0, ufReferencia: 0, disponibilidad: 0 }
    ]);
  };

  const removeTipologia = (id: string) => {
    if (tipologias.length > 1) {
      setTipologias(tipologias.filter(t => t.id !== id));
    }
  };

  const updateTipologia = (id: string, field: keyof Tipologia, value: string | number) => {
    setTipologias(tipologias.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleImageUpload = (type: 'principal' | 'galeria' | 'planos') => {
    // Simulated upload - in real app would use file input
    const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800`;
    
    if (type === 'principal') {
      setImagenPrincipal(mockUrl);
    } else if (type === 'galeria') {
      setGaleria([...galeria, mockUrl]);
    } else {
      setPlanos([...planos, mockUrl]);
    }
  };

  const removeImage = (type: 'principal' | 'galeria' | 'planos', index?: number) => {
    if (type === 'principal') {
      setImagenPrincipal(null);
    } else if (type === 'galeria' && index !== undefined) {
      setGaleria(galeria.filter((_, i) => i !== index));
    } else if (type === 'planos' && index !== undefined) {
      setPlanos(planos.filter((_, i) => i !== index));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
      if (!inmobiliariaId) newErrors.inmobiliaria = 'Selecciona una inmobiliaria';
      if (!comuna) newErrors.comuna = 'Selecciona una comuna';
    }
    
    if (stepNumber === 2) {
      if (!ufDesde || parseFloat(ufDesde) <= 0) newErrors.ufDesde = 'Ingresa un valor válido';
      const validTipologias = tipologias.filter(t => t.tipo);
      if (validTipologias.length === 0) newErrors.tipologias = 'Agrega al menos una tipología';
    }
    
    if (stepNumber === 3) {
      if (!imagenPrincipal) newErrors.imagenPrincipal = 'La imagen principal es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!validateStep(3)) return;
    
    // Create project (mock)
    const newProjectId = Date.now().toString();
    
    toast({
      title: "Proyecto creado",
      description: `El proyecto "${nombre}" ha sido creado exitosamente.`,
    });
    
    onOpenChange(false);
    navigate(`/proyectos/${newProjectId}`);
  };

  const resetForm = () => {
    setStep(1);
    setNombre('');
    setInmobiliariaId('');
    setComuna('');
    setDireccion('');
    setEstado('activo');
    setFechaEntrega(undefined);
    setUfDesde('');
    setUfHasta('');
    setDescripcion('');
    setTipologias([{ id: '1', tipo: '', superficieUtil: 0, superficieTotal: 0, ufReferencia: 0, disponibilidad: 0 }]);
    setImagenPrincipal(null);
    setGaleria([]);
    setPlanos([]);
    setEsIntegracion(false);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Crear nuevo proyecto</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Paso {step} de 4: {step === 1 ? 'Información general' : step === 2 ? 'Atributos comerciales' : step === 3 ? 'Imágenes' : 'Integración'}
          </p>
        </DialogHeader>

        <div className="mt-4">
          {/* Step 1: Información general */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Nombre del proyecto *</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Vista Cordillera"
                  className={cn("mt-1", errors.nombre && "border-destructive")}
                />
                {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Inmobiliaria *</Label>
                  <Select value={inmobiliariaId} onValueChange={setInmobiliariaId}>
                    <SelectTrigger className={cn("mt-1", errors.inmobiliaria && "border-destructive")}>
                      <SelectValue placeholder="Seleccionar inmobiliaria" />
                    </SelectTrigger>
                    <SelectContent>
                      {INMOBILIARIAS.map((inm) => (
                        <SelectItem key={inm.id} value={inm.id}>{inm.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.inmobiliaria && <p className="text-xs text-destructive mt-1">{errors.inmobiliaria}</p>}
                </div>

                <div>
                  <Label className="text-xs">Comuna *</Label>
                  <Select value={comuna} onValueChange={setComuna}>
                    <SelectTrigger className={cn("mt-1", errors.comuna && "border-destructive")}>
                      <SelectValue placeholder="Seleccionar comuna" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMUNAS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.comuna && <p className="text-xs text-destructive mt-1">{errors.comuna}</p>}
                </div>
              </div>

              <div>
                <Label className="text-xs">Dirección (opcional)</Label>
                <Input
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Apoquindo 1234"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Estado del proyecto</Label>
                  <Select value={estado} onValueChange={setEstado}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_PROYECTO.map((e) => (
                        <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Fecha estimada de entrega</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !fechaEntrega && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fechaEntrega ? format(fechaEntrega, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fechaEntrega}
                        onSelect={setFechaEntrega}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Atributos comerciales */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">UF desde *</Label>
                  <Input
                    type="number"
                    value={ufDesde}
                    onChange={(e) => setUfDesde(e.target.value)}
                    placeholder="Ej: 3000"
                    className={cn("mt-1", errors.ufDesde && "border-destructive")}
                  />
                  {errors.ufDesde && <p className="text-xs text-destructive mt-1">{errors.ufDesde}</p>}
                </div>

                <div>
                  <Label className="text-xs">UF hasta</Label>
                  <Input
                    type="number"
                    value={ufHasta}
                    onChange={(e) => setUfHasta(e.target.value)}
                    placeholder="Ej: 5500"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Descripción comercial</Label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción del proyecto para clientes..."
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Tipologías *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTipologia}>
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar
                  </Button>
                </div>
                {errors.tipologias && (
                  <p className="text-xs text-destructive mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.tipologias}
                  </p>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[600px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-2 text-left font-medium">Tipología</th>
                        <th className="p-2 text-left font-medium">Sup. útil (m²)</th>
                        <th className="p-2 text-left font-medium">Sup. total (m²)</th>
                        <th className="p-2 text-left font-medium">UF ref.</th>
                        <th className="p-2 text-left font-medium">Disp.</th>
                        <th className="p-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tipologias.map((tip, index) => (
                        <tr key={tip.id} className="border-t border-border">
                          <td className="p-2">
                            <Select
                              value={tip.tipo}
                              onValueChange={(v) => updateTipologia(tip.id, 'tipo', v)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIPOLOGIAS_OPTIONS.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={tip.superficieUtil || ''}
                              onChange={(e) => updateTipologia(tip.id, 'superficieUtil', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={tip.superficieTotal || ''}
                              onChange={(e) => updateTipologia(tip.id, 'superficieTotal', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={tip.ufReferencia || ''}
                              onChange={(e) => updateTipologia(tip.id, 'ufReferencia', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={tip.disponibilidad || ''}
                              onChange={(e) => updateTipologia(tip.id, 'disponibilidad', parseInt(e.target.value) || 0)}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeTipologia(tip.id)}
                              disabled={tipologias.length === 1}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Imágenes */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Imagen principal */}
              <div>
                <Label className="text-xs">Imagen principal *</Label>
                {errors.imagenPrincipal && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.imagenPrincipal}
                  </p>
                )}
                <div className="mt-2">
                  {imagenPrincipal ? (
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden max-w-xs">
                      <img src={imagenPrincipal} alt="Principal" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => removeImage('principal')}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleImageUpload('principal')}
                      className={cn(
                        "aspect-video max-w-xs border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors",
                        errors.imagenPrincipal ? "border-destructive" : "border-border"
                      )}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Subir imagen principal</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Galería */}
              <div>
                <Label className="text-xs">Galería (mínimo 4 recomendado)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {galeria.map((img, index) => (
                    <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      <img src={img} alt={`Galería ${index + 1}`} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage('galeria', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div
                    onClick={() => handleImageUpload('galeria')}
                    className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">Agregar</span>
                  </div>
                </div>
              </div>

              {/* Planos */}
              <div>
                <Label className="text-xs">Plantas / Planos (opcional)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {planos.map((img, index) => (
                    <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                      <img src={img} alt={`Plano ${index + 1}`} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage('planos', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div
                    onClick={() => handleImageUpload('planos')}
                    className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Image className="w-6 h-6 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">Plano</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Integración */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                <Checkbox
                  id="integracion"
                  checked={esIntegracion}
                  onCheckedChange={(checked) => setEsIntegracion(checked as boolean)}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="integracion"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Proyecto proveniente de integración externa
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Marca esta opción si el proyecto se sincroniza con un sistema externo (ERP, CRM, etc.)
                  </p>
                </div>
              </div>

              {esIntegracion && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-600">Nota sobre integraciones</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Los proyectos con integración externa pueden recibir actualizaciones automáticas. 
                        Aún así, podrás editar los campos manualmente cuando sea necesario.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="text-sm font-medium mb-3">Resumen del proyecto</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{nombre || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Inmobiliaria:</span>
                    <p className="font-medium">{INMOBILIARIAS.find(i => i.id === inmobiliariaId)?.name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Comuna:</span>
                    <p className="font-medium">{comuna || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rango UF:</span>
                    <p className="font-medium">{ufDesde || '-'} - {ufHasta || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipologías:</span>
                    <p className="font-medium">{tipologias.filter(t => t.tipo).length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Imágenes:</span>
                    <p className="font-medium">{(imagenPrincipal ? 1 : 0) + galeria.length + planos.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 1) {
                onOpenChange(false);
              } else {
                handleBack();
              }
            }}
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </Button>
          
          <Button
            type="button"
            onClick={() => {
              if (step === 4) {
                handleSubmit();
              } else {
                handleNext();
              }
            }}
          >
            {step === 4 ? 'Guardar proyecto' : 'Siguiente'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
