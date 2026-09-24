"use client";

import { useState, type FormEvent } from "react";
import type { Category, ProductFormValues } from "@/types/product";

interface FormFields {
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  rating: string;
  thumbnail: string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

interface Props {
  readonly initialValues?: ProductFormValues;
  readonly categories: Category[];
  readonly isSubmitting: boolean;
  readonly submitLabel: string;
  readonly onSubmit: (values: ProductFormValues) => void;
}

function toFormFields(values?: ProductFormValues): FormFields {
  return {
    title: values?.title ?? "",
    description: values?.description ?? "",
    category: values?.category ?? "",
    price: values ? String(values.price) : "",
    stock: values ? String(values.stock) : "",
    rating: values ? String(values.rating) : "",
    thumbnail: values?.thumbnail ?? "",
  };
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (fields.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  if (fields.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }
  if (!fields.category) {
    errors.category = "Please select a category.";
  }

  const price = Number(fields.price);
  if (!fields.price || Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  const stock = Number(fields.stock);
  if (!fields.stock || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = "Stock must be a whole number of 0 or more.";
  }

  const rating = Number(fields.rating);
  if (!fields.rating || Number.isNaN(rating) || rating < 0 || rating > 5) {
    errors.rating = "Rating must be a number between 0 and 5.";
  }

  if (!fields.thumbnail.trim().startsWith("http")) {
    errors.thumbnail = "Please enter a valid image URL (starting with http).";
  }

  return errors;
}

export default function ProductForm({ initialValues, categories, isSubmitting, submitLabel, onSubmit }: Props) {
  const [fields, setFields] = useState<FormFields>(() => toFormFields(initialValues));
  const [errors, setErrors] = useState<FormErrors>({});

  function setField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      title: fields.title.trim(),
      description: fields.description.trim(),
      category: fields.category,
      price: Number(fields.price),
      stock: Number(fields.stock),
      rating: Number(fields.rating),
      thumbnail: fields.thumbnail.trim(),
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={fields.title}
          onChange={(e) => setField("title", e.target.value)}
          className={inputClass}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={fields.description}
          onChange={(e) => setField("description", e.target.value)}
          className={inputClass}
        />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category"
          value={fields.category}
          onChange={(e) => setField("category", e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && <p className={errorClass}>{errors.category}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={fields.price}
            onChange={(e) => setField("price", e.target.value)}
            className={inputClass}
          />
          {errors.price && <p className={errorClass}>{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium text-slate-700">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            value={fields.stock}
            onChange={(e) => setField("stock", e.target.value)}
            className={inputClass}
          />
          {errors.stock && <p className={errorClass}>{errors.stock}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="rating" className="mb-1 block text-sm font-medium text-slate-700">
            Rating (0-5)
          </label>
          <input
            id="rating"
            type="number"
            step="0.1"
            value={fields.rating}
            onChange={(e) => setField("rating", e.target.value)}
            className={inputClass}
          />
          {errors.rating && <p className={errorClass}>{errors.rating}</p>}
        </div>

        <div>
          <label htmlFor="thumbnail" className="mb-1 block text-sm font-medium text-slate-700">
            Image URL
          </label>
          <input
            id="thumbnail"
            type="text"
            value={fields.thumbnail}
            onChange={(e) => setField("thumbnail", e.target.value)}
            className={inputClass}
          />
          {errors.thumbnail && <p className={errorClass}>{errors.thumbnail}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
