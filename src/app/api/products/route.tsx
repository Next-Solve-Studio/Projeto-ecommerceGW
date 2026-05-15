// app/api/products/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { ApiResponse, Product } from "@/types/products";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // Obter parâmetros de query para paginação e filtros
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const offset = parseInt(searchParams.get("offset") || "0", 10);
        const categoryId = searchParams.get("category_id");
        const search = searchParams.get("search");

        let query = supabase.from("products").select("*");

        // Aplicar filtros
        if (categoryId) {
            query = query.eq("category_id", categoryId);
        }

        if (search) {
            query = query.or(
                `name.ilike.%${search}%,description.ilike.%${search}%`,
            );
        }

        // Aplicar paginação
        const { data, error, count } = await query
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
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
                data: {
                    products: data as Product[],
                    total: count || 0,
                    limit,
                    offset,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao buscar produtos",
            } as ApiResponse<null>,
            { status: 500 },
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
                    error: "Não autorizado",
                } as ApiResponse<null>,
                { status: 401 },
            );
        }

        const body = await request.json();
        const { name, description, price, stock, image_url, category_id } =
            body;

        // Validar campos obrigatórios
        if (!name || price === undefined || stock === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Campos obrigatórios: name, price, stock",
                } as ApiResponse<null>,
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("products")
            .insert([
                {
                    name,
                    description,
                    price,
                    stock,
                    image_url,
                    category_id,
                },
            ])
            .select();

        if (error) {
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
                data: data[0] as Product,
                message: "Produto criado com sucesso",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao criar produto",
            } as ApiResponse<null>,
            { status: 500 },
        );
    }
}
