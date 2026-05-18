"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from '@/lib/supabase/client';
import { toast } from "sonner";
import ProductForm from "./sections/product/ProductForm";
import ProductTable from "./sections/product/ProductTable";
import CategoryForm from "./sections/category/CategoryForm"; // se criado
import CategoryTable from "./sections/category/CategoryTable"; // se criado
import type { Category, Product } from "@/types/products";

// ─── Tipos locais ───────────────────────────────────
type Tab = "products" | "categories";

interface ProductFormState {
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
}

interface CategoryFormState {
    name: string;
    description: string;
}

// ─── Funções utilitárias (pode importar de lib/format) ─
const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });

export default function AdminMain() {
    const [tab, setTab] = useState<Tab>("products");

    // Produtos
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productForm, setProductForm] = useState<ProductFormState>({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submittingProduct, setSubmittingProduct] = useState(false);

    // Categorias
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCats, setLoadingCats] = useState(false);
    const [catForm, setCatForm] = useState<CategoryFormState>({
        name: "",
        description: "",
    });
    const [submittingCat, setSubmittingCat] = useState(false);

    const supabaseRef = useRef(createClient());

    // ─── Fetch ─────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoadingProducts(true);
        try {
            const r = await fetch("/api/products?limit=100");
            const d = await r.json();
            if (d.success) setProducts(d.data.products);
            else toast.error(d.error || "Erro ao buscar produtos");
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        setLoadingCats(true);
        try {
            const r = await fetch("/api/categories");
            const d = await r.json();
            if (d.success) setCategories(d.data);
            else toast.error(d.error || "Erro ao buscar categorias");
        } finally {
            setLoadingCats(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    // ─── Submissões ─────────────────────────────────────
    const submitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productForm.name || !productForm.price || !productForm.stock) {
            toast.error("Preencha nome, preço e estoque");
            return;
        }
        setSubmittingProduct(true);
        try {
            let image_url: string | null = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);

                const uploadRes = await fetch("/api/products/upload", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                
                if (!uploadData.success) {
                    toast.error(uploadData.error || "Erro no upload da imagem");
                    setSubmittingProduct(false);
                    return;
                }

                image_url = uploadData.path;
            }
            const r = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: productForm.name,
                    description: productForm.description || null,
                    price: parseFloat(productForm.price.replace(",", ".")),
                    stock: parseInt(productForm.stock),
                    image_url,                      // já é a URL pública completa
                    category_id: productForm.category_id
                    ? parseInt(productForm.category_id)
                    : null,
                }),
            });
            const d = await r.json();
            if (d.success) {
                toast.success("Produto criado com sucesso!");
                setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    category_id: "",
                });
                setImageFile(null);
                setImagePreview(null);
                fetchProducts();
            } else {
                toast.error(d.error || "Erro ao criar produto");
            }
        } finally {
            setSubmittingProduct(false);
        }
    };

    const submitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catForm.name) {
            toast.error("Preencha o nome");
            return;
        }
        setSubmittingCat(true);
        try {
            const r = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: catForm.name,
                    description: catForm.description || null,
                }),
            });
            const d = await r.json();
            if (d.success) {
                toast.success("Categoria criada!");
                setCatForm({ name: "", description: "" });
                fetchCategories();
            } else {
                toast.error(d.error || "Erro ao criar categoria");
            }
        } finally {
            setSubmittingCat(false);
        }
    };

    const deleteCategory = async (id: number, name: string) => {
        if (!confirm(`Deletar categoria "${name}"?`)) return;
        const r = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) {
            toast.success("Categoria deletada");
            fetchCategories();
        } else {
            toast.error(d.error || "Erro ao deletar");
        }
    };

    // ─── Classes Tailwind para os botões das abas ──────
    const tabBaseClass =
        "px-7 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200";
    const activeTabClass = "bg-black text-sky-400";
    const inactiveTabClass = "bg-gray-200 text-gray-600 hover:bg-gray-300";

    return (
        <div className="min-h-screen py-8 px-5 bg-[#F5F5F5] mt-40">
            <div className="max-w-[1100px] mx-auto">
                {/* Cabeçalho */}
                <div className="flex items-center gap-3.5 mb-8">
                    <span className="bg-black text-sky-400 rounded-lg px-3 py-1 text-[11px] font-bold tracking-wide">
                        ⚙ ADMIN
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Painel Administrativo
                    </h1>
                </div>

                {/* Abas */}
                <div className="flex gap-2 mb-7">
                    <button
                        type="button"
                        className={`${tabBaseClass} ${tab === "products" ? activeTabClass : inactiveTabClass}`}
                        onClick={() => setTab("products")}
                    >
                        🎮 Produtos ({products.length})
                    </button>
                    <button
                        type="button"
                        className={`${tabBaseClass} ${tab === "categories" ? activeTabClass : inactiveTabClass}`}
                        onClick={() => setTab("categories")}
                    >
                        📂 Categorias ({categories.length})
                    </button>
                </div>

                {/* Conteúdo das abas */}
                {tab === "products" && (
                    <div className="grid gap-6 items-start grid-cols-[360px_1fr]">
                        <ProductForm
                            form={productForm}
                            categories={categories}
                            submitting={submittingProduct}
                            imagePreview={imagePreview}
                            onChangeField={(field, value) =>
                                setProductForm((p) => ({ ...p, [field]: value }))
                            }
                            onImageChange={(file) => {
                                setImageFile(file);
                                setImagePreview(file ? URL.createObjectURL(file) : null);
                            }}
                            onSubmit={submitProduct}
                        />
                        <ProductTable
                            products={products}
                            loadingProducts={loadingProducts}
                            fetchProducts={fetchProducts}
                            categories={categories}
                        />
                    </div>
                )}

                {tab === "categories" && (
                    <div className="grid gap-6 items-start grid-cols-[360px_1fr]">
                        <CategoryForm
                            form={catForm}
                            submitting={submittingCat}
                            onChangeField={(field, value) =>
                                setCatForm((p) => ({ ...p, [field]: value }))
                            }
                            onSubmit={submitCategory}
                        />
                        {/* Tabela de categorias (exemplo simples com Tailwind) */}
                        <CategoryTable
                            categories={categories}
                            loading={loadingCats}
                            fetchCategories={fetchCategories}
                            onDelete={deleteCategory}
                        />
                    </div>
                )}
            </div>

        </div>
    );
}
