"use client";
import { useState } from 'react';
import { CategoriesProvider } from '@/context/CategoriesContext';
import ProductForm from './sections/product/ProductForm';
import ProductTable from './sections/product/ProductTable';
import CategoryForm from './sections/category/CategoryForm';
import CategoryTable from './sections/category/CategoryTable';
import TabButton from './ui/TabButton';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { SyntheticEvent } from "react";

type Tab = "products" | "categories";

export default function AdminMain() {
    const [tab, setTab] = useState<Tab>("products");

    const {
        products,
        loading: loadingProducts,
        form: productForm,
        submitting: submittingProduct,
        updateFormField: updateProductField,
        submitProduct,
        fetchProducts,
    } = useProducts();

    const {
        categories,
        loading: loadingCats,
        form: catForm,
        submitting: submittingCat,
        updateFormField: updateCatField,
        submitCategory,
        deleteCategory,
        fetchCategories,
    } = useCategories();

    const {
        imagePreview,
        handleFileChange,
        uploadImage,
        resetImage,
    } = useImageUpload();

    const handleProductSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const imageUrl = await uploadImage();

        if (await submitProduct(imageUrl)) {
            resetImage();
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f6f8] pt-8 pb-16 px-6 mt-40">
            <div className="max-w-300 mx-auto">

                {/* Cabeçalho */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="flex items-center gap-1.5 bg-black text-blue px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-[0.12em] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                        <span>Admin</span>
                    </div>
                    <div className="w-px h-5 bg-gray-300" />
                    <h1 className="text-xl font-semibold text-[#111827] tracking-tight">
                        Painel Administrativo
                    </h1>
                </div>

                {/* Abas */}
                <div className="flex gap-2 mb-8 bg-white border border-gray-200 p-1 rounded-xl w-fit shadow-sm">
                    <TabButton
                        active={tab === 'products'}
                        onClick={() => setTab('products')}
                        icon="products"
                        label="Produtos"
                        count={products.length}
                    />
                    <TabButton
                        active={tab === 'categories'}
                        onClick={() => setTab('categories')}
                        icon="categories"
                        label="Categorias"
                        count={categories.length}
                    />
                </div>

                {/* Conteúdo das abas */}
                <CategoriesProvider categories={categories}>
                {tab === 'products' && (
                    <div className="grid gap-6 items-start grid-cols-[360px_1fr]">
                    <ProductForm
                        form={productForm}
                        categories={categories}
                        submitting={submittingProduct}
                        imagePreview={imagePreview}
                        onChangeField={updateProductField}
                        onImageChange={handleFileChange}
                        onSubmit={handleProductSubmit}
                    />
                    <ProductTable
                        products={products}
                        loadingProducts={loadingProducts}
                        fetchProducts={fetchProducts}
                    />
                    </div>
                )}

                {tab === 'categories' && (
                    <div className="grid gap-6 items-start grid-cols-[360px_1fr]">
                    <CategoryForm
                        form={catForm}
                        submitting={submittingCat}
                        onChangeField={updateCatField}
                        onSubmit={submitCategory}
                    />
                    <CategoryTable
                        loading={loadingCats}
                        fetchCategories={fetchCategories}
                        onDelete={deleteCategory}
                    />
                    </div>
                )}
                </CategoriesProvider>
            </div>
        </div>
    );
}