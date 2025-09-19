import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export type BreadcrumbType = {
  name: string;
  link: string;
};

interface BreadcrumbProps {
  items: BreadcrumbType[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-black mb-8 text-sm sm:text-base">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div
            key={`${item.link}-${index}`}
            className="flex items-center gap-1 sm:gap-2"
          >
            {isLast ? (
              <span
                className="text-[#de1448] whitespace-nowrap text-sm sm:text-base "
                title={item.name}
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.link}
                className="hover:text-[#de1448] whitespace-nowrap text-sm sm:text-base "
                title={item.name}
              >
                {item.name}
              </Link>
            )}

            {index < items.length - 1 && (
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
