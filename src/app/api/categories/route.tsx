// app/api/categories/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { ApiResponse, Category } from '@/types/products';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data as Category[],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar categorias',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Verificar se o usuário está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Não autorizado',
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    // Validar campos obrigatórios
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campo obrigatório: name',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name,
          description,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data[0] as Category,
        message: 'Categoria criada com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao criar categoria',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
