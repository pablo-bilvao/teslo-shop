"use server";

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .positive()
    .transform((value) => Number(value).toFixed(2)),
  inStock: z.coerce
    .number()
    .positive()
    .transform((value) => Number(value)),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((value) => value.split(",")),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createOrUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.log(productParsed.error);

    return {
      ok: false,
    };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim();
  const { id, ...productData } = product;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tags = productData.tags
        .split(",")
        .map((tag) => tag.toLowerCase().trim());

      const productDataToSave = {
        ...productData,
        price: parseFloat(productData.price),
        sizes: {
          set: productData.sizes as Size[],
        },
        tags: {
          set: tags,
        },
      };

      if (id) {
        product = await tx.product.update({
          where: { id },
          data: productDataToSave,
        });

        console.log({
          updatedProduct: product,
        });
      } else {
        product = await tx.product.create({
          data: productDataToSave,
        });

        console.log({
          createdProduct: product,
        });
      }

      if (formData.has("images")) {
        const images = formData.getAll("images") as File[];
        if (images.length) {
          const imageUrls = await uploadImages(images);
          if (!imageUrls) {
            throw new Error("Error uploading images");
          }

          await prisma.productImage.createMany({
            data: imageUrls.imageUrls.map((url) => ({
              url,
              productId: product.id,
            })),
          });
        }
      }

      return {
        product,
      };
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${prismaTx.product.slug}`);
    revalidatePath(`/product/${prismaTx.product.slug}`);

    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (e) {
    console.error(e);

    return {
      ok: false,
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((res) => res.secure_url);
      })
    );

    return {
      imageUrls,
    };
  } catch (e) {
    console.error(e);

    return null;
  }
};
