
'use client';

import { FiRefreshCw, FiFolder } from 'react-icons/fi';
import { BsTrash } from 'react-icons/bs';
import { useCategories } from '@/context/CategoriesContext';

const fmtDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(new Date(date));

interface CategoryTableProps {
  loading: boolean;
  fetchCategories: () => void;
  onDelete: (id: number, name: string) => void;
}
export default function CategoryTable({loading,fetchCategories, onDelete}:CategoryTableProps) {
    const { categories } = useCategories();
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md overflow-hidden">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <FiFolder className="text-sky-400" size={18} />
                    Categorias cadastradas
                </h2>
                <button
                    type="button"
                    onClick={fetchCategories}
                    className="flex items-center gap-1.5 text-sky-400 font-bold text-sm hover:text-sky-500 transition-colors"
                >
                    <FiRefreshCw size={14} />
                    Atualizar
                </button>
            </div>

        {/* Estados */}
        {loading ? (
            <p className="text-center text-sm text-gray-400 py-10">Carregando…</p>
        ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-300 gap-3">
            <FiFolder size={40} />
            <p className="text-sm font-medium text-gray-400">
                Nenhuma categoria cadastrada ainda.
            </p>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                        <FiFolder size={13} />
                        Nome
                    </span>
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4 whitespace-nowrap">
                    Descrição
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4 whitespace-nowrap">
                    Criada em
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 pb-3" />
                </tr>
                </thead>
                <tbody>
                {categories.map((cat) => (
                    <tr
                    key={cat.id_categ}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                    <td className="py-3 pr-4">
                        <span className="font-semibold text-gray-800 text-[13px]">
                        {cat.name}
                        </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-[13px]">
                        {cat.description || '—'}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-400 whitespace-nowrap">
                        {fmtDate(cat.created_at)}
                    </td>
                    <td className="py-3 pr-4 text-right">
                        <button
                        type="button"
                        onClick={() => onDelete(cat.id_categ, cat.name)}
                        className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Deletar categoria"
                        >
                        <BsTrash size={16} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    )
}
