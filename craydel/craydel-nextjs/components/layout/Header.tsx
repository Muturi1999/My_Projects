'use client';

import { useState } from 'react';
import Topbar from './Topbar';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { Button } from '@/components/ui/button';
import { Search, Menu } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="style-1">
        <Topbar />
        <div className="container d-flex flex-nowrap align-items-center justify-content-between">
          <Link href="/" className="header-logo d-lg-none d-block">
            <img
              src="/images/logo.svg"
              alt="mobile-logo"
              width={130}
              height={50}
            />
          </Link>
          <div className="main-menu">
            <div className="mobile-logo-area d-lg-none d-flex align-items-center justify-content-between">
              <Link href="/" className="mobile-logo-wrap">
                <img
                  src="/images/logo.svg"
                  alt="mobile-logo"
                  width={130}
                  height={50}
                />
              </Link>
              <div className="menu-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="bi bi-x"></i>
              </div>
            </div>
            <Navigation className="d-lg-flex d-none" />
          </div>
          <div className="nav-right d-flex align-items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="d-lg-flex d-none">
                  <Search className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Find Your Perfect Tour Package"
                    className="w-full"
                  />
                  <Button className="w-full">Search</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="d-lg-none d-block"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
