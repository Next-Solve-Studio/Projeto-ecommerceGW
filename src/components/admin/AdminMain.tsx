"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

/* ─── Types ─────────────────────────────────────── */
interface Category {
    id_categ: number;
    name: string;
    description: string | null;
    created_at: string;
}

interface Product {
    id_prod: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    category_id: number | null;
    created_at: string;
    categories?: { name: string } | null;
}

type Tab = "products" | "categories";

const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });

interface ToastItem {
    id: number;
    msg: string;
    type: "success" | "error";
}

function Toast({ toasts }: { toasts: ToastItem[] }) {
    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    style={{
                        background:
                            t.type === "success" ? "#22c55e" : "#ef4444",
                        color: "#fff",
                        padding: "12px 18px",
                        borderRadius: 10,
                        fontWeight: 600,
                        fontSize: 14,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                        minWidth: 220,
                    }}
                >
                    {t.type === "success" ? "✓ " : "✕ "}
                    {t.msg}
                </div>
            ))}
        </div>
    );
}

export default function AdminMain() {
    const [tab, setTab] = useState<Tab>("products");
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submittingProduct, setSubmittingProduct] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCats, setLoadingCats] = useState(false);
    const [catForm, setCatForm] = useState({ name: "", description: "" });
    const [submittingCat, setSubmittingCat] = useState(false);

    const addToast = useCallback((msg: string, type: "success" | "error") => {
        const id = Date.now();
        setToasts((p) => [...p, { id, msg, type }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoadingProducts(true);
        try {
            const r = await fetch("/api/admin/products?limit=100");
            const d = await r.json();
            if (d.success) setProducts(d.data.products);
            else addToast(d.error || "Erro ao buscar produtos", "error");
        } finally {
            setLoadingProducts(false);
        }
    }, [addToast]);

    const fetchCategories = useCallback(async () => {
        setLoadingCats(true);
        try {
            const r = await fetch("/api/categories");
            const d = await r.json();
            if (d.success) setCategories(d.data);
            else addToast(d.error || "Erro ao buscar categorias", "error");
        } finally {
            setLoadingCats(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const submitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productForm.name || !productForm.price || !productForm.stock) {
            addToast("Preencha nome, preço e estoque", "error");
            return;
        }
        setSubmittingProduct(true);
        try {
            let image_url: string | null = null;
            if (imageFile) {
                const fd = new FormData();
                fd.append("file", imageFile);
                const upRes = await fetch("/api/products/upload", {
                    method: "POST",
                    body: fd,
                });
                const upData = await upRes.json();
                if (!upData.success) {
                    addToast(upData.error || "Erro no upload", "error");
                    return;
                }
                image_url = upData.path;
            }
            const r = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: productForm.name,
                    description: productForm.description || null,
                    price: parseFloat(productForm.price.replace(",", ".")),
                    stock: parseInt(productForm.stock),
                    image_url,
                    category_id: productForm.category_id
                        ? parseInt(productForm.category_id)
                        : null,
                }),
            });
            const d = await r.json();
            if (d.success) {
                addToast("Produto criado com sucesso!", "success");
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
                addToast(d.error || "Erro ao criar produto", "error");
            }
        } finally {
            setSubmittingProduct(false);
        }
    };

    const submitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catForm.name) {
            addToast("Preencha o nome", "error");
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
                addToast("Categoria criada!", "success");
                setCatForm({ name: "", description: "" });
                fetchCategories();
            } else addToast(d.error || "Erro ao criar categoria", "error");
        } finally {
            setSubmittingCat(false);
        }
    };

    const deleteCategory = async (id: number, name: string) => {
        if (!confirm(`Deletar categoria "${name}"?`)) return;
        const r = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
        const d = await r.json();
        if (d.success) {
            addToast("Categoria deletada", "success");
            fetchCategories();
        } else addToast(d.error || "Erro ao deletar", "error");
    };

    const s: Record<string, React.CSSProperties> = {
        page: {
            minHeight: "100vh",
            background: "#F5F5F5",
            fontFamily: "Poppins, sans-serif",
            padding: "32px 20px",
        },
        inner: { maxWidth: 1100, margin: "0 auto" },
        header: {
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 32,
        },
        badge: {
            background: "#0D0D0D",
            color: "#79C4F2",
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
        },
        title: { fontSize: 26, fontWeight: 700, color: "#0D0D0D", margin: 0 },
        tabs: { display: "flex", gap: 8, marginBottom: 28 },
        grid: {
            display: "grid",
            gridTemplateColumns: "360px 1fr",
            gap: 24,
            alignItems: "start",
        },
        card: {
            background: "#fff",
            borderRadius: 16,
            padding: 28,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        },
        cardTitle: {
            fontSize: 16,
            fontWeight: 700,
            color: "#0D0D0D",
            marginBottom: 20,
        },
        label: {
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#8C8C8C",
            marginBottom: 5,
        },
        input: {
            width: "100%",
            padding: "10px 14px",
            borderRadius: 9,
            border: "1.5px solid #e5e7eb",
            fontSize: 14,
            fontFamily: "Poppins, sans-serif",
            outline: "none",
            marginBottom: 14,
            background: "#fafafa",
            boxSizing: "border-box",
        } as React.CSSProperties,
        select: {
            width: "100%",
            padding: "10px 14px",
            borderRadius: 9,
            border: "1.5px solid #e5e7eb",
            fontSize: 14,
            fontFamily: "Poppins, sans-serif",
            outline: "none",
            marginBottom: 14,
            background: "#fafafa",
            appearance: "none",
            boxSizing: "border-box",
        } as React.CSSProperties,
        btn: {
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: "#0D0D0D",
            color: "#79C4F2",
            fontWeight: 700,
            fontSize: 14,
            fontFamily: "Poppins, sans-serif",
            cursor: "pointer",
        },
        table: { width: "100%", borderCollapse: "collapse" as const },
        th: {
            textAlign: "left" as const,
            fontSize: 11,
            fontWeight: 700,
            color: "#8C8C8C",
            letterSpacing: 0.5,
            padding: "0 12px 12px",
            borderBottom: "1.5px solid #f0f0f0",
        },
        td: {
            padding: "13px 12px",
            fontSize: 13,
            color: "#0D0D0D",
            borderBottom: "1px solid #f5f5f5",
            verticalAlign: "middle" as const,
        },
        empty: {
            textAlign: "center" as const,
            padding: 40,
            color: "#8C8C8C",
            fontSize: 14,
        },
        tag: {
            background: "#f0f4f8",
            color: "#8C8C8C",
            borderRadius: 6,
            padding: "2px 8px",
            fontSize: 11,
            fontWeight: 600,
        },
        delBtn: {
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ef4444",
            fontSize: 14,
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: 6,
        },
        rowImgWrap: {
            width: 44,
            height: 44,
            borderRadius: 8,
            overflow: "hidden",
            background: "#f0f0f0",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
    };

    const getTabStyle = (active: boolean): React.CSSProperties => ({
        padding: "10px 28px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 14,
        fontFamily: "Poppins, sans-serif",
        transition: "all .18s",
        background: active ? "#0D0D0D" : "#e5e7eb",
        color: active ? "#79C4F2" : "#6b7280",
    });

    const getStockBadgeStyle = (n: number): React.CSSProperties => ({
        background: n === 0 ? "#fee2e2" : n < 5 ? "#fef9c3" : "#dcfce7",
        color: n === 0 ? "#ef4444" : n < 5 ? "#ca8a04" : "#16a34a",
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 700,
    });

    return (
        <div style={s.page}>
            <div style={s.inner}>
                <div style={s.header}>
                    <span style={s.badge}>⚙ ADMIN</span>
                    <h1 style={s.title}>Painel Administrativo</h1>
                </div>

                <div style={s.tabs}>
                    <button
                        type="button"
                        style={getTabStyle(tab === "products")}
                        onClick={() => setTab("products")}
                    >
                        🎮 Produtos ({products.length})
                    </button>
                    <button
                        type="button"
                        style={getTabStyle(tab === "categories")}
                        onClick={() => setTab("categories")}
                    >
                        📂 Categorias ({categories.length})
                    </button>
                </div>

                {tab === "products" && (
                    <div style={s.grid}>
                        <div style={s.card}>
                            <p style={s.cardTitle}>➕ Novo Produto</p>
                            <form onSubmit={submitProduct}>
                                <span style={s.label}>Nome *</span>
                                <input
                                    style={s.input}
                                    placeholder="Ex: Mouse Gamer Razer"
                                    value={productForm.name}
                                    onChange={(e) =>
                                        setProductForm((p) => ({
                                            ...p,
                                            name: e.target.value,
                                        }))
                                    }
                                />

                                <span style={s.label}>Descrição</span>
                                <input
                                    style={s.input}
                                    placeholder="Descrição do produto"
                                    value={productForm.description}
                                    onChange={(e) =>
                                        setProductForm((p) => ({
                                            ...p,
                                            description: e.target.value,
                                        }))
                                    }
                                />

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 12,
                                    }}
                                >
                                    <div>
                                        <span style={s.label}>
                                            Preço (R$) *
                                        </span>
                                        <input
                                            style={s.input}
                                            placeholder="299,90"
                                            value={productForm.price}
                                            onChange={(e) =>
                                                setProductForm((p) => ({
                                                    ...p,
                                                    price: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <span style={s.label}>Estoque *</span>
                                        <input
                                            style={s.input}
                                            type="number"
                                            min="0"
                                            placeholder="10"
                                            value={productForm.stock}
                                            onChange={(e) =>
                                                setProductForm((p) => ({
                                                    ...p,
                                                    stock: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <span style={s.label}>Imagem do Produto</span>
                                <label
                                    style={{
                                        display: "block",
                                        border: "2px dashed #e5e7eb",
                                        borderRadius: 10,
                                        padding: imagePreview
                                            ? "0"
                                            : "20px 14px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        marginBottom: 14,
                                        overflow: "hidden",
                                        background: "#fafafa",
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                        style={{ display: "none" }}
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview ? (
                                        <div style={{ position: "relative" }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                style={{
                                                    width: "100%",
                                                    maxHeight: 180,
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />
                                            {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background:
                                                        "rgba(0,0,0,0.35)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    opacity: 0,
                                                    transition: "opacity .2s",
                                                }}
                                                // biome-ignore lint/suspicious/noAssignInExpressions: <>
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.opacity =
                                                        "1")
                                                }
                                                // biome-ignore lint/suspicious/noAssignInExpressions: <>
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.opacity =
                                                        "0")
                                                }
                                            >
                                                <span
                                                    style={{
                                                        background:
                                                            "rgba(0,0,0,0.6)",
                                                        color: "#fff",
                                                        padding: "6px 14px",
                                                        borderRadius: 8,
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Trocar imagem
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                color: "#8C8C8C",
                                                fontSize: 13,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 28,
                                                    marginBottom: 6,
                                                }}
                                            >
                                                🖼️
                                            </div>
                                            <div style={{ fontWeight: 600 }}>
                                                Clique para selecionar
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    marginTop: 4,
                                                }}
                                            >
                                                JPG, PNG, WEBP ou GIF
                                            </div>
                                        </div>
                                    )}
                                </label>

                                <span style={s.label}>Categoria</span>
                                <select
                                    style={s.select}
                                    value={productForm.category_id}
                                    onChange={(e) =>
                                        setProductForm((p) => ({
                                            ...p,
                                            category_id: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">Sem categoria</option>
                                    {categories.map((c) => (
                                        <option
                                            key={c.id_categ}
                                            value={c.id_categ}
                                        >
                                            {c.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    style={s.btn}
                                    type="submit"
                                    disabled={submittingProduct}
                                >
                                    {submittingProduct
                                        ? "Salvando…"
                                        : "Salvar Produto"}
                                </button>
                            </form>
                        </div>

                        <div style={s.card}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 18,
                                }}
                            >
                                <p style={{ ...s.cardTitle, margin: 0 }}>
                                    📦 Produtos cadastrados
                                </p>
                                <button
                                    type="button"
                                    onClick={fetchProducts}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#79C4F2",
                                        fontWeight: 700,
                                        fontSize: 13,
                                    }}
                                >
                                    ↻ Atualizar
                                </button>
                            </div>
                            {loadingProducts ? (
                                <p style={s.empty}>Carregando…</p>
                            ) : products.length === 0 ? (
                                <p style={s.empty}>
                                    Nenhum produto cadastrado ainda.
                                </p>
                            ) : (
                                <div style={{ overflowX: "auto" }}>
                                    <table style={s.table}>
                                        <thead>
                                            <tr>
                                                <th style={s.th}>Produto</th>
                                                <th style={s.th}>Preço</th>
                                                <th style={s.th}>Estoque</th>
                                                <th style={s.th}>Categoria</th>
                                                <th style={s.th}>Criado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((p) => (
                                                <tr key={p.id_prod}>
                                                    <td style={s.td}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 10,
                                                            }}
                                                        >
                                                            <div
                                                                style={
                                                                    s.rowImgWrap
                                                                }
                                                            >
                                                                {p.image_url ? (
                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                    <Image
                                                                        src={
                                                                            p.image_url
                                                                        }
                                                                        alt={
                                                                            p.name
                                                                        }
                                                                        fill
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            objectFit:
                                                                                "cover",
                                                                        }}
                                                                        onError={(
                                                                            e,
                                                                        ) => {
                                                                            (
                                                                                e.target as HTMLImageElement
                                                                            ).style.display =
                                                                                "none";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        🎮
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div
                                                                    style={{
                                                                        fontWeight: 600,
                                                                        fontSize: 13,
                                                                    }}
                                                                >
                                                                    {p.name}
                                                                </div>
                                                                {p.description && (
                                                                    <div
                                                                        style={{
                                                                            fontSize: 11,
                                                                            color: "#8C8C8C",
                                                                            maxWidth: 180,
                                                                            overflow:
                                                                                "hidden",
                                                                            textOverflow:
                                                                                "ellipsis",
                                                                            whiteSpace:
                                                                                "nowrap",
                                                                        }}
                                                                    >
                                                                        {
                                                                            p.description
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={s.td}>
                                                        <strong>
                                                            {fmt(p.price)}
                                                        </strong>
                                                    </td>
                                                    <td style={s.td}>
                                                        <span
                                                            style={getStockBadgeStyle(
                                                                p.stock,
                                                            )}
                                                        >
                                                            {p.stock}
                                                        </span>
                                                    </td>
                                                    <td style={s.td}>
                                                        <span style={s.tag}>
                                                            {p.categories
                                                                ?.name ?? "—"}
                                                        </span>
                                                    </td>
                                                    <td
                                                        style={{
                                                            ...s.td,
                                                            color: "#8C8C8C",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {fmtDate(p.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === "categories" && (
                    <div style={s.grid}>
                        <div style={s.card}>
                            <p style={s.cardTitle}>➕ Nova Categoria</p>
                            <form onSubmit={submitCategory}>
                                <span style={s.label}>Nome *</span>
                                <input
                                    style={s.input}
                                    placeholder="Ex: Mouses"
                                    value={catForm.name}
                                    onChange={(e) =>
                                        setCatForm((p) => ({
                                            ...p,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                                <span style={s.label}>Descrição</span>
                                <input
                                    style={s.input}
                                    placeholder="Descrição opcional"
                                    value={catForm.description}
                                    onChange={(e) =>
                                        setCatForm((p) => ({
                                            ...p,
                                            description: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    style={s.btn}
                                    type="submit"
                                    disabled={submittingCat}
                                >
                                    {submittingCat
                                        ? "Salvando…"
                                        : "Salvar Categoria"}
                                </button>
                            </form>
                        </div>

                        <div style={s.card}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 18,
                                }}
                            >
                                <p style={{ ...s.cardTitle, margin: 0 }}>
                                    📂 Categorias cadastradas
                                </p>
                                <button
                                    type="button"
                                    onClick={fetchCategories}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#79C4F2",
                                        fontWeight: 700,
                                        fontSize: 13,
                                    }}
                                >
                                    ↻ Atualizar
                                </button>
                            </div>
                            {loadingCats ? (
                                <p style={s.empty}>Carregando…</p>
                            ) : categories.length === 0 ? (
                                <p style={s.empty}>
                                    Nenhuma categoria cadastrada ainda.
                                </p>
                            ) : (
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th style={s.th}>Nome</th>
                                            <th style={s.th}>Descrição</th>
                                            <th style={s.th}>Criada em</th>
                                            <th style={s.th}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((c) => (
                                            <tr key={c.id_categ}>
                                                <td style={s.td}>
                                                    <strong>{c.name}</strong>
                                                </td>
                                                <td
                                                    style={{
                                                        ...s.td,
                                                        color: "#8C8C8C",
                                                    }}
                                                >
                                                    {c.description || "—"}
                                                </td>
                                                <td
                                                    style={{
                                                        ...s.td,
                                                        color: "#8C8C8C",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {fmtDate(c.created_at)}
                                                </td>
                                                <td style={s.td}>
                                                    <button
                                                        type="button"
                                                        style={s.delBtn}
                                                        onClick={() =>
                                                            deleteCategory(
                                                                c.id_categ,
                                                                c.name,
                                                            )
                                                        }
                                                        title="Deletar"
                                                    >
                                                        🗑
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Toast toasts={toasts} />
        </div>
    );
}
