'use client';

import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import LanguageSelector from '@/components/common/LanguageSelector';
import Link from 'next/link';

export default function Topbar() {
  return (
    <div className="topbar-area d-lg-block d-none">
      <div className="container">
        <div className="topbar-wrap">
          <div className="logo-and-search-area">
            <Link href="/" className="header-logo">
              <img
                src="/images/logo.svg"
                alt="logo-image"
                width={160}
                height={50}
              />
            </Link>
            <form className="search-area" method="get" role="search">
              <div className="form-inner">
                <button type="submit">
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M15.8044 14.8855L13.0544 12.198L12.99 12.1002C12.8688 11.9807 12.7055 11.9137 12.5353 11.9137C12.3651 11.9137 12.2018 11.9807 12.0806 12.1002C9.74343 14.2443 6.14312 14.3605 3.66561 12.3724C1.18811 10.3843 0.604677 6.90645 2.30061 4.24832C3.99655 1.5902 7.44655 0.573637 10.3631 1.87332C13.2797 3.17301 14.755 6.38739 13.8125 9.38239C13.7793 9.48905 13.7753 9.60268 13.8011 9.71137C13.8269 9.82007 13.8815 9.91983 13.9591 10.0002C14.0375 10.082 14.1358 10.1421 14.2443 10.1746C14.3528 10.2071 14.4679 10.211 14.5784 10.1858C14.6883 10.1616 14.79 10.109 14.8732 10.0332C14.9564 9.95744 15.0182 9.86113 15.0525 9.75395C16.1775 6.19989 14.4781 2.37489 11.0525 0.75395C7.62686 -0.866988 3.50468 0.200824 1.35124 3.26864C-0.802198 6.33645 -0.34001 10.4818 2.43905 13.0239C5.21811 15.5661 9.47968 15.7408 12.4687 13.4377L14.9037 15.8183C15.026 15.9358 15.1889 16.0014 15.3584 16.0014C15.5279 16.0014 15.6909 15.9358 15.8131 15.8183C15.8728 15.7599 15.9201 15.6902 15.9525 15.6133C15.9848 15.5363 16.0015 15.4537 16.0015 15.3702C16.0015 15.2867 15.9848 15.2041 15.9525 15.1271C15.9201 15.0502 15.8728 14.9805 15.8131 14.9221L15.8044 14.8855Z" />
                    </g>
                  </svg>
                </button>
                <input type="text" name="s" placeholder="Find Your Perfect Tour Package" />
                <input type="hidden" name="post_type" value="tour" />
              </div>
            </form>
          </div>
          <div className="topbar-right">
            <div className="support-and-language-area">
              <Link href="/contact">Need Help?</Link>
              <LanguageSelector />
            </div>
            <Button asChild variant="default" size="sm" className="primary-btn1 black-bg">
              <Link href="/login">
                <span>
                  <User className="h-4 w-4" />
                  Login
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
