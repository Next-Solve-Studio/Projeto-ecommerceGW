'use client';
import { FiPlusCircle } from 'react-icons/fi';
import type { SyntheticEvent } from "react";

interface CategoryFormState {
  name: string;
  description: string;
}

interface CategoryFormProps {
  readonly form: CategoryFormState;
  readonly submitting: boolean;
  readonly onChangeField: (field: keyof CategoryFormState, value: string) => void;
  readonly onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
}

const inputClass = `
    w-full px-3.5 py-2.5 text-sm text-gray-800 bg-[#f8fafc]
    border border-gray-200 rounded-xl
    placeholder:text-gray-400 font-medium
    focus:outline-none focus:border-gray-400 focus:bg-white
    transition-all duration-150
`;

const spanClass = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function CategoryForm({
    form,
    submitting,
    onChangeField,
    onSubmit,
}: CategoryFormProps) {

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f9ff] text-blue">
                <FiPlusCircle size={16} />
                </span>
                <span>Nova Categoria</span>
            </h2>
            </div>

            <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
            <div>
                <span className={spanClass}>Nome *</span>
                <input
                    className={inputClass}
                    placeholder="Ex: Mouses"
                    value={form.name}
                    onChange={(e) => onChangeField('name', e.target.value)}
                />
            </div>

            <div>
                <span className={spanClass}>Descrição</span>
                <textarea
                    className={`${inputClass} resize-none h-24`}
                    placeholder="Descrição opcional"
                    value={form.description}
                    onChange={(e) => onChangeField('description', e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className={`
                w-full py-3 rounded-xl text-sm font-bold tracking-wide
                transition-all duration-200
                ${submitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-blue hover:bg-[#1a1a1a] active:scale-[0.99]'
                }
                `}
            >
                {submitting ? 'Salvando…' : 'Salvar Categoria'}
            </button>
            </form>
        </div>
    );
}
