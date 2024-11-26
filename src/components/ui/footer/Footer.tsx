import { titleFont } from "@/config/fonts";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
      <Link href="/" className="mr-3">
        <span className={`${titleFont.className} antialiased font-bold`}>
          Teslo
        </span>
        <span>| Shop</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </Link>

      <Link href="/" className="mr-3">
        Privacy Policy
      </Link>

      <Link href="/" className="mr-3">
        Ubicaciones
      </Link>
    </div>
  );
};
