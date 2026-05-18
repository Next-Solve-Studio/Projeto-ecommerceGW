// hooks/useCategories.ts
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { Category } from '@/types/products';

interface CategoryFormState {
  name: string;
  description: string;
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<CategoryFormState>({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
        const r = await fetch('/api/categories');
        const d = await r.json();
        if (d.success) setCategories(d.data);
        else toast.error(d.error || 'Erro ao buscar categorias');
        } finally {
        setLoading(false);
        }
    }, []);

    const updateFormField = useCallback((field: keyof CategoryFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setForm({ name: '', description: '' });
    }, []);

    const submitCategory = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name) {
        toast.error('Preencha o nome');
        return;
        }
        setSubmitting(true);
        try {
        const r = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: form.name, description: form.description || null }),
        });
        const d = await r.json();
        if (d.success) {
            toast.success('Categoria criada!');
            resetForm();
            await fetchCategories();
        } else {
            toast.error(d.error || 'Erro ao criar categoria');
        }
        } finally {
        setSubmitting(false);
        }
    }, [form, fetchCategories, resetForm]);

    const deleteCategory = useCallback(async (id: number, name: string) => {
        if (!confirm(`Deletar categoria "${name}"?`)) return;
        const r = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
        const d = await r.json();
        if (d.success) {
        toast.success('Categoria deletada');
        await fetchCategories();
        } else {
        toast.error(d.error || 'Erro ao deletar');
        }
    }, [fetchCategories]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        form,
        submitting,
        updateFormField,
        resetForm,
        submitCategory,
        deleteCategory,
        fetchCategories,
    };
}