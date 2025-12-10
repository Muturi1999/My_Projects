'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { menuItems, type MenuItem } from '@/data/menuItems';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const renderMenuItem = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      return (
        <li key={item.label} className="menu-item menu-item-has-children">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <a href="#" className="menu-link d-flex align-items-center">
                {item.label}
                <i className="bi-caret-right-fill dropdown-icon ms-1"></i>
                <i className="d-lg-none d-flex bi bi-plus dropdown-icon ms-1"></i>
              </a>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px]">
              {item.children.map((child) => (
                <DropdownMenuItem key={child.label} asChild>
                  <Link href={child.href} className="cursor-pointer">
                    {child.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      );
    }

    return (
      <li key={item.label} className="menu-item">
        <Link href={item.href} className="menu-link">
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <ul id="menu-main-menu" className={cn('menu-list', className)}>
      {menuItems.map(renderMenuItem)}
    </ul>
  );
}
