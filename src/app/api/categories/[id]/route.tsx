// app/api/categories/[id]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { ApiResponse, Category } from "@/types/products";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("id_categ", params.id)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Categoria não encontrada",
                    } as ApiResponse<null>,
                    { status: 404 },
                );
            }
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                } as ApiResponse<null>,
                { status: 400 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: data as Category,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Erro ao buscar categoria:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao buscar categoria",
            } as ApiResponse<null>,
            { status: 500 },
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
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
                    error: "Não autorizado",
                } as ApiResponse<null>,
                { status: 401 },
            );
        }

        const body = await request.json();
        const { name, description } = body;

        // Validar que pelo menos um campo foi fornecido
        if (!name && !description) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Nenhum campo para atualizar foi fornecido",
                } as ApiResponse<null>,
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("categories")
            .update({ name, description })
            .eq("id_categ", params.id)
            .select()
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Categoria não encontrada",
                    } as ApiResponse<null>,
                    { status: 404 },
                );
            }
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                } as ApiResponse<null>,
                { status: 400 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: data as Category,
                message: "Categoria atualizada com sucesso",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao atualizar categoria",
            } as ApiResponse<null>,
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
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
                    error: "Não autorizado",
                } as ApiResponse<null>,
                { status: 401 },
            );
        }

        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id_categ", params.id);

        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Categoria não encontrada",
                    } as ApiResponse<null>,
                    { status: 404 },
                );
            }
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                } as ApiResponse<null>,
                { status: 400 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Categoria deletada com sucesso",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao deletar categoria",
            } as ApiResponse<null>,
            { status: 500 },
        );
    }
}
