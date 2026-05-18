"use client";
import Image from "next/image";
import type { Category } from "@/types/products";


import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import { FiPlusCircle, FiImage } from "react-icons/fi";

interface ProductFormState {
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
}

interface ProductFormProps {
    form: ProductFormState;
    categories: Category[];
    submitting: boolean;
    imagePreview: string | null;
    onChangeField: (field: keyof ProductFormState, value: string) => void;
    onImageChange: (file: File | null) => void;
    onSubmit: (e: React.FormEvent) => void;
}
export default function ProductForm({
    form,
    categories,
    submitting,
    imagePreview,
    onChangeField,
    onImageChange,
    onSubmit,
}: ProductFormProps) {
    /**
     * Manipula a seleção de arquivo de imagem.
     * Extrai o primeiro arquivo e notifica o pai via onImageChange.
     * O pai decide se cria URL.createObjectURL e atualiza o estado.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onImageChange(file);
    };

    return (
        <div className="bg-white rounded-2xl p-7 shadow-md">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-5">
                <FiPlusCircle className="text-sky-400" size={18} />
                Novo Produto
            </h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {/* Nome */}
                <TextField
                    label="Nome *"
                    placeholder="Ex: Mouse Gamer Razer"
                    value={form.name}
                    onChange={(e) => onChangeField("name", e.target.value)}
                    size="small"
                    fullWidth
                />

                {/* Descrição */}
                <TextField
                    label="Descrição"
                    placeholder="Descrição do produto"
                    value={form.description}
                    onChange={(e) =>
                        onChangeField("description", e.target.value)
                    }
                    size="small"
                    fullWidth
                />

                {/* Preço e Estoque */}
                <div className="grid grid-cols-2 gap-3">
                    <TextField
                        label="Preço (R$) *"
                        placeholder="299,90"
                        value={form.price}
                        onChange={(e) =>
                            onChangeField("price", e.target.value)
                        }
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label="Estoque *"
                        type="number"
                        placeholder="10"
                        value={form.stock}
                        onChange={(e) =>
                            onChangeField("stock", e.target.value)
                        }
                        slotProps={{
                            htmlInput: { min: 0 }
                        }}
                        size="small"
                        fullWidth
                    />
                </div>

                {/* Upload de Imagem */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                        Imagem do Produto
                    </p>
                    <label className="block relative border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer overflow-hidden group">
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {imagePreview ? (
                            <div className="relative w-full h-44">
                                <Image
                                    src={imagePreview}
                                    alt="Preview da imagem"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-black/60 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                                        Trocar imagem
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-1">
                                <FiImage size={36} />
                                <span className="font-semibold text-sm text-gray-500">
                                    Clique para selecionar
                                </span>
                                <span className="text-xs">
                                    JPG, PNG, WEBP ou GIF
                                </span>
                            </div>
                        )}
                    </label>
                </div>

                {/* Categoria */}
                <FormControl size="small" fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                        label="Categoria"
                        value={form.category_id}
                        onChange={(e) =>
                            onChangeField("category_id", e.target.value)
                        }
                    >
                        <MenuItem value="">
                            <em>Sem categoria</em>
                        </MenuItem>
                        {categories.map((c) => (
                            <MenuItem key={c.id_categ} value={c.id_categ}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Submit */}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    fullWidth
                    sx={{
                        py: 1.5,
                        bgcolor: "#000",
                        color: "#38bdf8",
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: 14,
                        "&:hover": { bgcolor: "#111827" },
                        "&.Mui-disabled": {
                            opacity: 0.6,
                            color: "#38bdf8",
                        },
                    }}
                >
                    {submitting ? "Salvando…" : "Salvar Produto"}
                </Button>
            </form>
        </div>
    );
}
