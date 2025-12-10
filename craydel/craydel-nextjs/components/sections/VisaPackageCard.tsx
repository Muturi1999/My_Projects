'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface VisaPackageCardProps {
  image: string;
  title: string;
  href: string;
  processingTime: string;
  delay?: number;
}

export default function VisaPackageCard({
  image,
  title,
  href,
  processingTime,
  delay = 0,
}: VisaPackageCardProps) {
  return (
    <motion.div
      className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInDown mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      data-wow-delay="200ms"
      data-wow-duration="1500ms"
    >
      <div className="visa-package-card text-center">
        <div className="visa-package-img-wrapper mb-3">
          <div className="visa-package-img-circle">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </div>
        <div className="visa-package-content">
          <h5 className="mb-2">
            <Link href={href} className="text-decoration-none text-dark">
              {title}
            </Link>
          </h5>
          <span className="text-muted small d-block">
            Processing Time - <strong className="text-dark">{processingTime}</strong>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
