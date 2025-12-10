import VisaPackageCard from './VisaPackageCard';

interface VisaPackage {
  image: string;
  title: string;
  href: string;
  processingTime: string;
}

interface VisaPackageGridProps {
  packages: VisaPackage[];
}

export default function VisaPackageGrid({ packages }: VisaPackageGridProps) {
  return (
    <div
      className="visa-package-grid-section"
      style={{
        backgroundImage: 'url(/images/visa-package-grid-bg.webp), linear-gradient(180deg, #F2F2FF 0%, #F2F2FF 100%)',
      }}
    >
      <div className="container">
        <div className="row gy-4">
          {packages.map((pkg, index) => (
            <VisaPackageCard
              key={index}
              {...pkg}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
