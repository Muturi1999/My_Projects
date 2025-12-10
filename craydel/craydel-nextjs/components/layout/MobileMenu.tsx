'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuItems, type MenuItem } from '@/data/menuItems';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);

    return (
      <div key={item.label}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleItem(item.label)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent transition-colors',
                level > 0 && 'pl-8'
              )}
            >
              <span className="font-medium">{item.label}</span>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isExpanded && 'rotate-90'
                )}
              />
            </button>
            {isExpanded && (
              <div className="bg-accent/50">
                {item.children?.map((child) => renderMenuItem(child, level + 1))}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.href}
            onClick={onClose}
            className={cn(
              'block px-4 py-3 hover:bg-accent transition-colors',
              level > 0 && 'pl-8'
            )}
          >
            {item.label}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-background shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-background border-b flex items-center justify-between p-4">
          <Link href="/" onClick={onClose}>
            <img
              src="/images/logo.svg"
              alt="GoFly Logo"
              className="h-8 w-auto"
            />
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="py-4">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
}

