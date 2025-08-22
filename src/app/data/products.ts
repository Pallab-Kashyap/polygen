// /data/products.ts

export interface ProductItem {
  name: string;
  imageUrl: string;
  slug: string;
  parentId?: string
  disabled?: boolean;
}

export interface ProductCategory {
  id?: string;
  title: string;
  slug: string;
  items: ProductItem[];
}

// Main data for the header dropdown
export const productCategories: ProductCategory[] = [
  {
    title: "Starter & Spares",
    slug: "starter-and-spares",
    items: [
      {
        name: "DOL Motor Starter",
        slug: "dol-motor-starter",
        imageUrl: "/assets/products/starter.png",
      },
      {
        name: "Single Phase Starter",
        slug: "single-phase-starter",
        imageUrl: "/assets/products/starter.png",
      },
      {
        name: "Contractor with Relay",
        slug: "contractor-with-relay",
        imageUrl: "/assets/products/contractor.png",
      },
      {
        name: "Contractor",
        slug: "contractor",
        imageUrl: "/assets/products/contractor.png",
      },
      {
        name: "Overload Relay",
        slug: "overload-relay",
        imageUrl: "/assets/products/contractor.png",
      },
      {
        name: "Spare Contact Kit",
        slug: "spare-contact-kit",
        imageUrl: "/assets/products/contractor.png",
      },
      {
        name: "No Volt Coil",
        slug: "no-volt-coil",
        imageUrl: "/assets/products/contractor.png",
      },
      {
        name: "4 Pati",
        slug: "4-Pati",
        imageUrl: "/assets/products/contractor.png",
      },
    ],
  },
  {
    title: "Wires & cables",
    slug: "wires-and-cables",
    items: [
      {
        name: "Aluminum Service Cables",
        slug: "aluminum-service-cables",
        imageUrl: "/assets/products/wire-1.png",
      },
      {
        name: "Multistrand Wires",
        slug: "multistrand-cables",
        imageUrl: "/assets/products/wire-2.png",
      },
      {
        name: "Submersible Cables",
        slug: "submersible-cables",
        imageUrl: "/assets/products/wire-3.png",
      },
      {
        name: "Round Flex Cables",
        slug: "round-flex-wires",
        imageUrl: "/assets/products/wire-4.png",
      },
      {
        name: "VIR Copper",
        slug: "vir-copper",
        imageUrl: "/assets/products/wire-5.png",
      },
    ],
  },
  {
    title: "Kit Kat Fuse",
    slug: "kit-kat-fuse",
    items: [
      {
        name: "Polygen Fuse 63A",
        slug: "fuse-63a",
        imageUrl: "/assets/products/fuse.png",
      },
      {
        name: "Brass Fuse",
        slug: "brass-fuse",
        imageUrl: "/assets/products/fuse.png",
      },
    ],
  },
  {
    title: "Amps & Volt Meter",
    slug: "amps-volt-meter",
    items: [
      {
        name: "Analog - Coming Soon",
        slug: "Analog",
        imageUrl: "",
        disabled: true,
      },
      {
        name: "Digital - Coming Soon",
        slug: "Digital",
        imageUrl: "",
        disabled: true,
      },
    ],
  },
  {
    title: "MCB",
    slug: "mcb",
    items: [
      {
        name: "Single Pole - Coming Soon",
        slug: "single-pole",
        imageUrl: "",
        disabled: true,
      },
      {
        name: "2 Pole - Coming Soon",
        slug: "2-Pole",
        imageUrl: "",
        disabled: true,
      },
      {
        name: "3 Pole - Coming Soon",
        slug: "3-Pole",
        imageUrl: "",
        disabled: true,
      },
      { name: "4 Pole - Coming Soon", slug: "4-pole", imageUrl: "", disabled: true },
    ],
  },
];

// A map to easily find a category by its slug for the product page
export const productsByCategory = new Map(
  productCategories.map((category) => [category.slug, category])
);
