"use client";
import Image from "next/image";
import type { Category } from "@/types/products";
import { FiPlusCircle, FiImage } from "react-icons/fi";
import type { SyntheticEvent } from "react";

interface ProductFormState {
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
}

interface ProductFormProps {
    readonly form: ProductFormState;
    readonly categories: Category[];
    readonly submitting: boolean;
    readonly imagePreview: string | null;
    readonly onChangeField: (field: keyof ProductFormState, value: string) => void;
    readonly onImageChange: (file: File | null) => void;
    readonly onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
}

const inputClass = `
    w-full px-3.5 py-2.5 text-sm text-gray-800 bg-[#f8fafc]
    border border-gray-200 rounded-xl
    placeholder:text-gray-400 font-medium
    focus:outline-none focus:border-gray-400 focus:bg-white
    transition-all duration-150
`;

const labelClass = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function ProductForm({
    form,
    categories,
    submitting,
    imagePreview,
    onChangeField,
    onImageChange,
    onSubmit,
}: ProductFormProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onImageChange(file);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f9ff] text-blue">
                        <FiPlusCircle size={16} />
                    </span>
                    <span>Novo Produto</span>
                </h2>
            </div>

            <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
                {/* Nome */}
                <div>
                    <span className={labelClass}>Nome *</span>
                    <input
                        className={inputClass}
                        placeholder="Ex: Mouse Gamer Razer"
                        value={form.name}
                        onChange={(e) => onChangeField("name", e.target.value)}
                    />
                </div>

                {/* Descrição */}
                <div>
                    <span className={labelClass}>Descrição</span>
                    <textarea
                        className={`${inputClass} resize-none h-20`}
                        placeholder="Descrição do produto"
                        value={form.description}
                        onChange={(e) => onChangeField("description", e.target.value)}
                    />
                </div>

                {/* Preço e Estoque */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <span className={labelClass}>Preço (R$) *</span>
                        <input
                            className={inputClass}
                            placeholder="299,90"
                            value={form.price}
                            onChange={(e) => onChangeField("price", e.target.value)}
                        />
                    </div>
                    <div>
                        <span className={labelClass}>Estoque *</span>
                        <input
                            className={inputClass}
                            type="number"
                            placeholder="10"
                            min={0}
                            value={form.stock}
                            onChange={(e) => onChangeField("stock", e.target.value)}
                        />
                    </div>
                </div>

                {/* Upload de Imagem */}
                <div>
                    <span className={labelClass}>Imagem do Produto</span>
                    <label className="block relative border-2 border-dashed border-gray-200 rounded-xl bg-[#fafafa] cursor-pointer overflow-hidden group hover:border-gray-300 transition-colors duration-150">
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {imagePreview ? (
                            <div className="relative w-full h-40">
                                <Image
                                    src={imagePreview}
                                    alt="Preview da imagem"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white/90 text-gray-800 px-4 py-1.5 rounded-lg text-xs font-semibold">
                                        Trocar imagem
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-7 text-gray-400 gap-1.5">
                                <FiImage size={28} className="text-gray-300" />
                                <span className="text-xs font-semibold text-gray-500 mt-1">
                                    Clique para selecionar
                                </span>
                                <span className="text-[11px] text-gray-400">
                                    JPG, PNG, WEBP ou GIF
                                </span>
                            </div>
                        )}
                    </label>
                </div>

                {/* Categoria */}
                <div>
                    <span className={labelClass}>Categoria</span>
                    <select
                        className={`${inputClass} cursor-pointer appearance-none`}
                        value={form.category_id}
                        onChange={(e) => onChangeField("category_id", e.target.value)}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                            paddingRight: "36px"
                        }}
                    >
                        <option value="">Sem categoria</option>
                        {categories.map((c) => (
                            <option key={c.id_categ} value={c.id_categ}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit */}
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
                    {submitting ? "Salvando…" : "Salvar Produto"}
                </button>
            </form>
        </div>
    );
}
