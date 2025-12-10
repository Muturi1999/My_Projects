export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    label: 'Home',
    href: '/',
    children: [
      { label: 'Main Home', href: '/' },
      { label: 'Travel Agency-01', href: '/travel-agency-01' },
      { label: 'Travel Agency-02', href: '/travel-agency-02' },
      { label: 'Travel Agency-03', href: '/travel-agency-03' },
      { label: 'Travel Agency-04', href: '/travel-agency-04' },
      { label: 'Experience-01', href: '/experience-01' },
      { label: 'Experience-02', href: '/experience-02' },
      { label: 'Visa Agency', href: '/visa-agency' },
      { label: 'City Tour', href: '/city-tour' },
    ],
  },
  {
    label: 'Destinations',
    href: '#',
    children: [
      { label: 'Africa', href: '/destinations/africa' },
      { label: 'Asia', href: '/destinations/asia' },
      { label: 'Europe', href: '/destinations/europe' },
      { label: 'Middle East', href: '/destinations/middle-east' },
      { label: 'North America', href: '/destinations/north-america' },
      { label: 'Oceania', href: '/destinations/oceania' },
    ],
  },
  {
    label: 'Travel Package',
    href: '#',
    children: [
      { label: 'Travel Package Style 01', href: '/tour' },
      { label: 'Travel Package Style 02', href: '/travel-package-02' },
      { label: 'Travel Package Details', href: '/tour/rome-florence-venice' },
    ],
  },
  {
    label: 'Visa',
    href: '#',
    children: [
      { label: 'Visa Package', href: '/visa-package-01' },
      { label: 'Visa Package Details', href: '/visa/australia' },
    ],
  },
  {
    label: 'Pages',
    href: '#',
    children: [
      { label: 'About GoFly', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

