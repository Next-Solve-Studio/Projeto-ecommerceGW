"use client";
import Image from "next/image";
import { FiRefreshCw, FiPackage, FiTag } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";

import type { Product, Category } from "@/types/products";

interface ProductTableProps {
    products: Product[];
    loadingProducts?: boolean;
    fetchProducts?: () => void;
    categories: Category[];
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

function StockBadge({ stock }: { stock: number }) {
    if (stock === 0)
        return (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                {stock}
            </span>
        );
    if (stock <= 5)
        return (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">
                {stock}
            </span>
        );
    return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600">
            {stock}
        </span>
    );
}

export default function ProductTable({
    products = [],
    loadingProducts = false,
    fetchProducts,
    categories,
}: ProductTableProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <FiPackage className="text-sky-400" size={18} />
                    Produtos cadastrados
                </h2>
                {fetchProducts && (
                    <button
                        type="button"
                        onClick={fetchProducts}
                        className="flex items-center gap-1.5 text-sky-400 font-bold text-sm hover:text-sky-500 transition-colors"
                    >
                        <FiRefreshCw size={14} />
                        Atualizar
                    </button>
                )}
            </div>

            {/* Estados */}
            {loadingProducts ? (
                <p className="text-center text-sm text-gray-400 py-10">
                    Carregando…
                </p>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-gray-300 gap-3">
                    <BsBoxSeam size={40} />
                    <p className="text-sm font-medium text-gray-400">
                        Nenhum produto cadastrado ainda.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {[
                                    {
                                        icon: <BsBoxSeam size={13} />,
                                        label: "Produto",
                                    },
                                    {
                                        icon: <FiTag size={13} />,
                                        label: "Preço",
                                    },
                                    {
                                        icon: <MdOutlineInventory2 size={13} />,
                                        label: "Estoque",
                                    },
                                    {
                                        icon: <FiPackage size={13} />,
                                        label: "Categoria",
                                    },
                                    { label: "Criado" },
                                ].map(({ icon, label }) => (
                                    <th
                                        key={label}
                                        className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4 whitespace-nowrap"
                                    >
                                        <span className="flex items-center gap-1">
                                            {icon}
                                            {label}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr
                                    key={p.id_prod}
                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Produto */}
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                                                {p.image_url ? (
                                                    <Image
                                                        src={p.image_url}
                                                        alt={p.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized 
                                                        onError={(e) => {
                                                            console.error('Erro ao carregar imagem:', p.image_url, e);
                                                            // (e.target as HTMLImageElement).style.display = 'none'; // comente por enquanto
                                                        }}
                                                    />
                                                ) : (
                                                    <BsBoxSeam
                                                        size={18}
                                                        className="text-gray-300"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-[13px]">
                                                    {p.name}
                                                </p>
                                                {p.description && (
                                                    <p className="text-[11px] text-gray-400 max-w-45 truncate">
                                                        {p.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Preço */}
                                    <td className="py-3 pr-4 font-semibold text-gray-700 whitespace-nowrap">
                                        {fmt(p.price)}
                                    </td>

                                    {/* Estoque */}
                                    <td className="py-3 pr-4">
                                        <StockBadge stock={p.stock} />
                                    </td>

                                    {/* Categoria */}
                                    <td className="py-3 pr-4">
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                            {p.categories?.name ?? "—"}
                                        </span>
                                    </td>

                                    {/* Data */}
                                    <td className="py-3 text-xs text-gray-400 whitespace-nowrap">
                                        {fmtDate(p.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
