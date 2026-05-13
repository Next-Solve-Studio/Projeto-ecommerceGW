// app/api/admin/upload/route.ts
// ⚠️  SEM AUTENTICAÇÃO — APENAS PARA USO LOCAL/TESTES
import type { NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { error } from 'console';

// Nome do bucket no Supabase Storage (ajuste se o seu tiver outro nome)
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'products-ecommerce';

function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!url) {
        throw error ("URL VAZIA")
    }

    const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    
    if (!serviceKey) {
        throw error ("serviceKey VAZIA")
    }
    return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo inválido. Use JPG, PNG, WEBP ou GIF.' },
        { status: 400 }
      );
    }

    // Gera nome único
    const ext = path.extname(file.name).toLowerCase();
    const baseName = path.basename(file.name, ext).replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    const fileName = `${baseName}_${Date.now()}${ext}`;

    const bytes = await file.arrayBuffer();

    const supabase = getAdminClient();

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Gera a URL pública do arquivo
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    return NextResponse.json({ success: true, path: urlData.publicUrl });
  } catch (err) {
    console.error('Erro no upload:', err);
    return NextResponse.json({ success: false, error: 'Erro ao fazer upload' }, { status: 500 });
  }
}
