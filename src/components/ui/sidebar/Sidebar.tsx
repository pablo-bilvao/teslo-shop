"use client";

import { logout } from "@/actions";
import { SidebarLink } from "@/components";
import { useUIStore } from "@/store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const { isSideMenuOpen, closeSideMenu } = useUIStore();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  return (
    <div>
      {isSideMenuOpen && (
        <>
          {/* Black background */}
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />

          {/* Blur */}
          <div
            onClick={closeSideMenu}
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          />
        </>
      )}

      {/* Side menu */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-[300px] md:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300 overflow-auto",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-10 md:right-5 cursor-pointer"
          onClick={closeSideMenu}
        />

        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
            placeholder="Buscar"
          />
        </div>
        {isAuthenticated && (
          <>
            {/* Menu */}
            <SidebarLink
              title="Perfil"
              icon={<IoPersonOutline size={30} />}
              link="/profile"
              onClick={closeSideMenu}
            />
            {!isAdmin && (
              <SidebarLink
                title="Ordenes"
                icon={<IoTicketOutline size={30} />}
                link="/orders"
                onClick={closeSideMenu}
              />
            )}

            <button
              onClick={() => {
                logout();
                closeSideMenu();
                window.location.replace("/"); //TODO: revisar
              }}
              className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoLogOutOutline size={30} />
              <span className="ml-3 text-xl">Salir</span>
            </button>
          </>
        )}

        {!isAuthenticated && (
          <SidebarLink
            title="Ingresar"
            icon={<IoLogInOutline size={30} />}
            link="/auth/login"
            onClick={closeSideMenu}
          />
        )}

        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className="w-full h-px bg-gray-200 my-10" />

            <SidebarLink
              title="Productos"
              icon={<IoShirtOutline size={30} />}
              link="/admin/products"
              onClick={closeSideMenu}
            />
            <SidebarLink
              title="Ordenes"
              icon={<IoTicketOutline size={30} />}
              link="/admin/orders"
              onClick={closeSideMenu}
            />
            <SidebarLink
              title="Usuarios"
              icon={<IoPeopleOutline size={30} />}
              link="/admin/users"
              onClick={closeSideMenu}
            />
          </>
        )}
      </nav>
    </div>
  );
};
