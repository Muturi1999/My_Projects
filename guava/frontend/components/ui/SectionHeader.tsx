import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  viewAllLink,
  viewAllText = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-8",
        className
      )}
    >
      <h2 className="section-heading">{title}</h2>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-black font-semibold text-sm transition-colors hover:opacity-80"
        >
          {viewAllText} →
        </Link>
      )}
    </div>
  );
}

