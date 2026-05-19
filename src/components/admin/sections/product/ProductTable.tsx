"use client";
import Image from "next/image";
import { FiRefreshCw, FiPackage } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import type { Product } from "@/types/products";
import { useCategories } from "@/context/CategoriesContext";

interface ProductTableProps {
    readonly products: readonly Product[];
    readonly loadingProducts?: boolean;
    readonly fetchProducts?: () => void;
}

const fmt = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);

const fmtDate = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));

interface StockBadgeProps {
  readonly stock: number;
}
function StockBadge({ stock }: StockBadgeProps) {
    if (stock === 0)
        return (
            <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-500 border border-red-100">
                {stock}
            </span>
        );
    if (stock <= 5)
        return (
            <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                {stock}
            </span>
        );
    return (
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            {stock}
        </span>
    );
}

const thClass = "text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-6 whitespace-nowrap";


export default function ProductTable({
    products = [],
    loadingProducts = false,
    fetchProducts,
}: ProductTableProps) {
    const { categoryMap } = useCategories();

    const renderContent = () => {
        if (loadingProducts) {
            return (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue rounded-full animate-spin" />
                        <p className="text-xs text-gray-400 font-medium">Carregando…</p>
                    </div>
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <BsBoxSeam size={22} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                        Nenhum produto cadastrado ainda.
                    </p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto py-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={thClass}>Produto</th>
                            <th className={thClass}>Preço</th>
                            <th className={thClass}>Estoque</th>
                            <th className={thClass}>Categoria</th>
                            <th className={thClass}>Criado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((p) => (
                            <tr
                                key={p.id_prod}
                                className="group hover:bg-[#fafbfc] transition-colors duration-100"
                            >
                                {/* Produto */}
                                <td className="py-3.5 pr-6">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                            {p.image_url ? (
                                                <Image
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BsBoxSeam size={14} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 text-[13px] truncate max-w-50">
                                                {p.name}
                                            </p>
                                            {p.description && (
                                                <p className="text-[11px] text-gray-400 truncate max-w-50">
                                                    {p.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Preço */}
                                <td className="py-3.5 pr-6">
                                    <span className="font-semibold text-gray-800 text-[13px] whitespace-nowrap">
                                        {fmt(p.price)}
                                    </span>
                                </td>

                                {/* Estoque */}
                                <td className="py-3.5 pr-6">
                                    <StockBadge stock={p.stock} />
                                </td>

                                {/* Categoria */}
                                <td className="py-3.5 pr-6">
                                    <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-semibold whitespace-nowrap">
                                        {p.category_id ? (categoryMap.get(String(p.category_id)) ?? '—') : '—'}
                                    </span>
                                </td>

                                {/* Data */}
                                <td className="py-3.5 text-[12px] text-gray-400 whitespace-nowrap font-medium">
                                    {fmtDate(p.created_at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f9ff] text-blue">
                        <FiPackage size={16} />
                    </span>
                    <span>Produtos cadastrados</span>
                    <span className="ml-1 text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                        {products.length}
                    </span>
                </h2>
                {fetchProducts && (
                    <button
                        type="button"
                        onClick={fetchProducts}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all duration-150"
                    >
                        <FiRefreshCw size={13} />
                        Atualizar
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="px-6">
                {renderContent()}
            </div>
            {products.length > 0 && (
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[11px] text-gray-400 font-medium">
                        {products.length} {products.length === 1 ? 'produto' : 'produtos'} no total
                    </p>
                </div>
            )}
        </div>
    );
}
