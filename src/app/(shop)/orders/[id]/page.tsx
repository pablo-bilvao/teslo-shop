import { getOrderById } from "@/actions";
import { auth } from "@/auth.config";
import { PayPalButton, Title, ProductImage as Image } from "@/components";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";
import { currencyFormat } from "../../../../utils/currencyFormat";

interface Props {
  params: { id: string };
}

export default async function OrderPage({ params }: Props) {
  const { id } = params;
  const { ok, message, order } = await getOrderById(id);
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  if (!ok) {
    return <p className="text-red-500">{message}</p>;
  }
  if (order?.userId !== user.id && user.role !== "admin") {
    return (
      <p className="text-red-500">You are not authorized to view this order</p>
    );
  }
  const { OrderAddress: address, OrderItem: items } = order!;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.slice(0, 8)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": !order!.isPaid,
                  "bg-green-700": order!.isPaid,
                }
              )}
            >
              <IoCardOutline size={30} />
              {order!.isPaid ? (
                <span className="mx-2">Pagada</span>
              ) : (
                <span className="mx-2">Pendiente de pago</span>
              )}
            </div>

            {/* Items */}
            {items.map(({ product, price, quantity }) => (
              <div key={product.id} className="flex mb-5">
                <Image
                  src={product.ProductImage?.[0]?.url}
                  width={100}
                  height={100}
                  alt={product.title}
                  className="mr-5 rounded object-cover"
                />

                <div>
                  <p>{product.title}</p>
                  <p>
                    {currencyFormat(price)} x {quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal {currencyFormat(price * quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Order */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>
                {address!.city}, {address!.country.name}
              </p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order!.itemsInOrder} artículos
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(order!.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {!order?.isPaid && (
                <PayPalButton orderId={order!.id} amount={order!.total} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
