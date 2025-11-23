// src/components/layout/Navbar/NavItem.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItemProps = {
  href: string;
  label: string;
};

export default function NavItem({ href, label }: NavItemProps) {
  const activeLinkClass =
    'block rounded-sm bg-orange-500 px-3 py-2 text-white md:bg-transparent md:p-0 md:text-orange-400';
  const inactiveLinkClass =
    'block rounded-sm px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-orange-400 dark:text-white';

  const pathname = usePathname();

  return (
    <li>
      <Link
        href={href}
        className={
          pathname.startsWith(href) ? activeLinkClass : inactiveLinkClass
        }
      >
        {label}
      </Link>
    </li>
  );
}
