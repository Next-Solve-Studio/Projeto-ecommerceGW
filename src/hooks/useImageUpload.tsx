// hooks/useImageUpload.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function useImageUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = useCallback((newFile: File | null) => {
        setFile(newFile);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(newFile ? URL.createObjectURL(newFile) : null);
    }, [preview]);

    const uploadImage = useCallback(async (): Promise<string | null> => {
        if (!file) return null;
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase.storage
        .from('products-ecommerce')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (error) {
        toast.error(error.message || 'Erro no upload da imagem');
        return null;
        }

        const { data } = supabase.storage.from('products-ecommerce').getPublicUrl(fileName);
        return data.publicUrl;
    }, [file]);

    const resetImage = useCallback(() => {
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
    }, [preview]);

    return {
        imageFile: file,
        imagePreview: preview,
        handleFileChange,
        uploadImage,
        resetImage,
    };
}