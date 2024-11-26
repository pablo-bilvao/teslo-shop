export const revalidate = 60; // in seconds

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/interfaces";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: {
    gender: Gender;
  };
  searchParams: {
    page?: string;
    take?: string;
  };
}

const availableCategories: Gender[] = ["men", "women", "kid", "unisex"];
const categoryLabels: Record<Gender, string> = {
  men: "hombres",
  women: "mujeres",
  kid: "niños",
  unisex: "todos",
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const take = searchParams.take ? parseInt(searchParams.take) : 12;

  if (!availableCategories.includes(gender)) {
    notFound();
  }

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    take,
    gender,
  });

  if (products.length === 0) {
    redirect(`/category/${gender}`);
  }

  return (
    <>
      <Title
        title={`Artículos para ${categoryLabels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
