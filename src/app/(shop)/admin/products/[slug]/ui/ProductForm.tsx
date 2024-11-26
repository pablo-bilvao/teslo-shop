"use client";

import { createOrUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage as Image } from "@/components";
import { Category, Gender, Product, ProductImage } from "@/interfaces";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  product:
    | (Product & { ProductImage?: ProductImage[]; images?: string[] })
    | null;
  categories: Category[];
}

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string; // comma separated
  gender: Gender;
  categoryId: string;

  images?: FileList;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
    // formState: { errors, isValid },
  } = useForm<FormInputs>({
    defaultValues: {
      title: product?.title ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? "",
      gender: product?.gender,
      price: product?.price,
      inStock: product?.inStock ?? 1,
      sizes: product?.sizes ?? [],
      tags: product?.tags.join(", ") ?? "",
    },
  });

  watch("sizes");

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    if (product?.id) {
      formData.append("id", product.id);
    }
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("inStock", data.inStock.toString());
    formData.append("sizes", data.sizes.join(","));
    formData.append("tags", data.tags);
    formData.append("categoryId", data.categoryId);
    formData.append("gender", data.gender);

    if (data.images) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    const { ok, product: savedProduct } = await createOrUpdateProduct(formData);
    if (ok) {
      router.replace(`/admin/products/${savedProduct?.slug}`);
    }
  };

  const onSizeChange = (size: string) => {
    const sizes = new Set(getValues("sizes"));

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    setValue("sizes", Array.from(sizes));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", {
              required: true,
            })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", {
              required: true,
            })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", {
              required: true,
            })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", {
              required: true,
              min: 0,
            })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", {
              required: true,
            })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", {
              required: true,
            })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", {
              required: true,
            })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-primary w-full">Guardar</button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", {
              required: true,
              min: 0,
            })}
          />
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                key={size}
                onClick={() => onSizeChange(size)}
                className={clsx(
                  "flex cursor-pointer items-center justify-center w-10 h-10 mr-2 border rounded-md",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              multiple
              {...register("images")}
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif, image/webp"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product?.ProductImage?.map((image) => (
              <div key={image.id}>
                <Image
                  alt={product.title}
                  src={image.url}
                  width={300}
                  height={300}
                  className="rounded-t shadow-md"
                />

                <button
                  type="button"
                  onClick={() => deleteProductImage(image.id, image.url)}
                  className="btn-danger rounded-b-xl w-full"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
