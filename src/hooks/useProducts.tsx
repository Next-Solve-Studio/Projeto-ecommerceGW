// hooks/useProducts.ts
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/types/products';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  category_id: string;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<ProductFormState>({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const r = await fetch('/api/products?limit=100');
            const d = await r.json();
            if (d.success) setProducts(d.data.products);
            else toast.error(d.error || 'Erro ao buscar produtos');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFormField = useCallback((field: keyof ProductFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
    }, []);

    const submitProduct = useCallback(async (imageUrl: string | null) => {
        if (!form.name || !form.price || !form.stock) {
            toast.error('Preencha nome, preço e estoque');
            return false;
        }
        setSubmitting(true);
        try {
        const r = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: form.name,
                description: form.description || null,
                price: parseFloat(form.price.replace(',', '.')),
                stock: parseInt(form.stock),
                image_url: imageUrl,
                category_id: form.category_id ? parseInt(form.category_id) : null,
            }),
        });
        const d = await r.json();
        if (d.success) {
            toast.success('Produto criado com sucesso!');
            resetForm();
            await fetchProducts();
            return true;
        } else {
            toast.error(d.error || 'Erro ao criar produto');
            return false;
        }
        } finally {
            setSubmitting(false);
        }
    }, [form, fetchProducts, resetForm]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        form,
        submitting,
        updateFormField,
        resetForm,
        submitProduct,
        fetchProducts,
    };
}