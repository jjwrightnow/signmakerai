import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MEMORY_TYPES, CONFIDENCE_LEVELS, type MemoryFormData } from './types';

interface MemoryFormProps {
  data: MemoryFormData;
  onChange: (data: MemoryFormData) => void;
}

export function MemoryForm({ data, onChange }: MemoryFormProps) {
  return (
    <div className="space-y-5">
      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="memory-content">What did you learn?</Label>
        <Textarea
          id="memory-content"
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="e.g. Never install channel letters below 40°F — the acrylic faces crack during handling."
          className="min-h-[100px] bg-secondary border-border"
        />
      </div>

      {/* Memory Type */}
      <div className="space-y-2">
        <Label>What kind of knowledge is this?</Label>
        <RadioGroup
          value={data.memory_type}
          onValueChange={(value) => onChange({ ...data, memory_type: value as MemoryFormData['memory_type'] })}
          className="grid gap-2"
        >
          {MEMORY_TYPES.map((type) => (
            <div key={type.value} className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value={type.value} id={`type-${type.value}`} className="mt-0.5" />
              <div className="space-y-0.5">
                <Label htmlFor={`type-${type.value}`} className="text-sm font-medium cursor-pointer">
                  {type.label}
                </Label>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Confidence */}
      <div className="space-y-2">
        <Label>How confident are you?</Label>
        <RadioGroup
          value={data.confidence}
          onValueChange={(value) => onChange({ ...data, confidence: value as MemoryFormData['confidence'] })}
          className="grid grid-cols-3 gap-2"
        >
          {CONFIDENCE_LEVELS.map((level) => (
            <div key={level.value} className="flex flex-col items-center space-y-1 rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value={level.value} id={`conf-${level.value}`} />
              <Label htmlFor={`conf-${level.value}`} className="text-xs font-medium cursor-pointer text-center">
                {level.label}
              </Label>
              <p className="text-[10px] text-muted-foreground text-center leading-tight">{level.description}</p>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
