import Link from 'next/link';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  backgroundImage?: string;
  title?: string;
}

export default function Breadcrumb({
  items,
  backgroundImage,
  title,
}: BreadcrumbProps) {
  return (
    <div
      className="breadcrumb-section"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImage})`
          : undefined,
      }}
    >
      <div className="container">
        <div className="banner-content">
          {title && <h1>{title}</h1>}
          <ul id="breadcrumb" className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            {items.map((item, index) => (
              <li key={index} className={item.href ? 'breadcrumb-item' : 'breadcrumb-item active'}>
                {item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
