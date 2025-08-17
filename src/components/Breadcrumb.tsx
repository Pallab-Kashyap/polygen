import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export type BreadcrumbType = {
    name: string,
    link: string
}

const Breadcrumb: React.FC<BreadcrumbType[] | []> = (items: BreadcrumbType[] | []) => {
  if (!items || items.length === 0) {
    return <></>;
  }

  return (
    <div className="flex space-x-2 text-black">
      {items.map((item) => (
        <div className="flex items-center gap-2 ">
          <Link href={item.link} className="hover:text-[#de1448]">
            {item.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
