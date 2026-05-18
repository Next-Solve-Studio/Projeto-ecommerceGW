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

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const imageUrl = await uploadImage();

        if (await submitProduct(imageUrl)) {
            resetImage();
        }
    };

    return (
        <div className="min-h-screen py-8 px-5 bg-[#F5F5F5] mt-40">
            <div className="max-w-275 mx-auto">
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
                    <TabButton
                        active={tab === 'products'}
                        onClick={() => setTab('products')}
                        icon="🎮"
                        label="Produtos"
                        count={products.length}
                    />
                    <TabButton
                        active={tab === 'categories'}
                        onClick={() => setTab('categories')}
                        icon="📂"
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