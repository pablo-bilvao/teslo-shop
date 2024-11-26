import Link from "next/link";

interface Props {
  title: string;
  icon: React.ReactNode;
  link: string;
  onClick?: () => void;
}

export const SidebarLink = ({ title, icon, link, ...rest }: Props) => {
  return (
    <Link
      href={link}
      className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      {...rest}
    >
      {icon}
      <span className="ml-3 text-xl">{title}</span>
    </Link>
  );
};
