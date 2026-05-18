'use client';
import { TextField, Button } from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';

interface CategoryFormState {
  name: string;
  description: string;
}

interface CategoryFormProps {
  form: CategoryFormState;
  submitting: boolean;
  onChangeField: (field: keyof CategoryFormState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CategoryForm({
  form,
  submitting,
  onChangeField,
  onSubmit,
}: CategoryFormProps) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-md">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-5">
        <FiPlusCircle className="text-sky-400" size={18} />
        Nova Categoria
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          label="Nome *"
          placeholder="Ex: Mouses"
          value={form.name}
          onChange={(e) => onChangeField('name', e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Descrição"
          placeholder="Descrição opcional"
          value={form.description}
          onChange={(e) => onChangeField('description', e.target.value)}
          size="small"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          fullWidth
          sx={{
            py: 1.5,
            bgcolor: '#000',
            color: '#38bdf8',
            fontWeight: 700,
            borderRadius: 2,
            fontSize: 14,
            '&:hover': { bgcolor: '#111827' },
            '&.Mui-disabled': { opacity: 0.6, color: '#38bdf8' },
          }}
        >
          {submitting ? 'Salvando…' : 'Salvar Categoria'}
        </Button>
      </form>
    </div>
  );
}