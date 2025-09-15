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
    <div className="flex space-x-2 text-black mb-8">
      {items.map((item, index) => (
        <div key={`${item.link}-${index}`} className="flex items-center gap-2">
          <Link href={item.link} className="hover:text-[#de1448] whitespace-nowrap">
            {item.name}
          </Link>
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
