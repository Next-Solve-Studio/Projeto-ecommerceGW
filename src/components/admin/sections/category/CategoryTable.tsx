'use client';

import { FiRefreshCw, FiFolder, FiTrash2 } from 'react-icons/fi';
import { useCategories } from '@/context/CategoriesContext';

const fmtDate = (date: string) =>
    new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    }).format(new Date(date));

interface CategoryTableProps {
    readonly loading: boolean;
    readonly fetchCategories: () => void;
    readonly onDelete: (id: number, name: string) => void;
}

const thClass = "text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-6 whitespace-nowrap";

export default function CategoryTable({ loading, fetchCategories, onDelete }: CategoryTableProps) {
    const { categories } = useCategories();

    const renderContent = () => {

        if (loading) {
            return (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-blue rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 font-medium">Carregando…</p>
                    </div>
                </div>
            )
        }

        if (categories.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <FiFolder size={22} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                        Nenhuma categoria cadastrada ainda.
                    </p>
                </div>
            )
        }

        return (
            <div className="overflow-x-auto py-4">
                <table className="w-full text-sm">
                <thead>
                    <tr>
                    <th className={thClass}>Nome</th>
                    <th className={thClass}>Descrição</th>
                    <th className={thClass}>Criada em</th>
                    <th className={`${thClass} text-right`}></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {categories.map((cat) => (
                    <tr
                        key={cat.id_categ}
                        className="group hover:bg-[#fafbfc] transition-colors duration-100"
                    >
                        <td className="py-3.5 pr-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#f0f9ff] flex items-center justify-center shrink-0">
                            <FiFolder size={13} className="text-blue" />
                            </div>
                            <span className="font-semibold text-gray-800 text-[13px] whitespace-nowrap">
                            {cat.name}
                            </span>
                        </div>
                        </td>
                        <td className="py-3.5 pr-6">
                        <span className="text-[13px] text-gray-500 max-w-50 truncate block">
                            {cat.description || (
                            <span className="text-gray-300">—</span>
                            )}
                        </span>
                        </td>
                        <td className="py-3.5 pr-6">
                        <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">
                            {fmtDate(cat.created_at)}
                        </span>
                        </td>
                        <td className="py-3.5 text-right">
                        <button
                            type="button"
                            onClick={() => onDelete(cat.id_categ, cat.name)}
                            title="Deletar categoria"
                            className="
                            opacity-0 group-hover:opacity-100
                            inline-flex items-center gap-1.5
                            text-[11px] font-semibold text-red-400 hover:text-red-600
                            bg-red-50 hover:bg-red-100
                            px-2.5 py-1.5 rounded-lg
                            transition-all duration-150
                            "
                        >
                            <FiTrash2 size={12} />
                            Deletar
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f9ff] text-blue">
                <FiFolder size={16} />
            </span>
            <span>Categorias cadastradas</span>
            <span className="ml-1 text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                {categories.length}
            </span>
            </h2>
            <button
            type="button"
            onClick={fetchCategories}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all duration-150"
            >
            <FiRefreshCw size={13} />
            Atualizar
            </button>
        </div>

        {/* Content */}
        <div className="px-6">
            {renderContent()}
        </div>
        {categories.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[11px] text-gray-400 font-medium">
                {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'} no total
            </p>
            </div>
        )}
        </div>
    );
}
