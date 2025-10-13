import { connectDB } from "@/lib/mongoose";
import Category from "@/models/Category";
import Product from "@/models/Product";

async function populateSampleData() {

    console.log('START')

  try {
    await connectDB();

    await Category.deleteMany({});
    await Product.deleteMany({});

    const wiresCategory = await Category.create({
      name: "Wires & Cables",
      slug: "wires-and-cables",
      description:
        "High-quality electrical wires and cables for all applications",
    });

    const starterCategory = await Category.create({
      name: "Starter & Spares",
      slug: "starter-and-spares",
      description: "Motor starters and spare parts",
    });

    const fuseCategory = await Category.create({
      name: "Kit Kat Fuse",
      slug: "kit-kat-fuse",
      description: "Electrical fuses and protection equipment",
    });

    const copperWiresCategory = await Category.create({
      name: "VIR Copper",
      slug: "vir-copper",
      description: "Vulcanized Indian Rubber copper wires",
      parentId: wiresCategory._id,
    });

    const aluminumCablesCategory = await Category.create({
      name: "Aluminum Service Cables",
      slug: "aluminum-service-cables",
      description: "Service cables made from aluminum",
      parentId: wiresCategory._id,
    });

    const submersibleCategory = await Category.create({
      name: "Submersible Cables",
      slug: "submersible-cables",
      description: "Cables for submersible pumps",
      parentId: wiresCategory._id,
    });

    const products = [
      {
        name: "VIR Copper Wire 2.5mm",
        slug: "vir-copper-wire-2-5mm",
        about: "High-quality VIR copper wire for electrical installations",
        categoryId: copperWiresCategory._id,
        images: ["/assets/product.svg"],
        price: 150.5,
        parameters: [
          {
            label: "Size",
            values: ["2.5mm", "4mm", "6mm"],
          },
          {
            label: "Material",
            values: ["Copper"],
          },
        ],
        applications: ["Residential wiring", "Commercial installations"],
        description: [
          {
            heading: "Features",
            bulletPoints: [
              { highlight: "High conductivity", text: "Made from pure copper" },
              { highlight: "Durable", text: "VIR insulation for longevity" },
            ],
          },
        ],
      },
      {
        name: "VIR Copper Wire 4mm",
        slug: "vir-copper-wire-4mm",
        about: "Heavy duty VIR copper wire for high current applications",
        categoryId: copperWiresCategory._id,
        images: ["/assets/product.svg"],
        price: 220.75,
        parameters: [
          {
            label: "Size",
            values: ["4mm"],
          },
          {
            label: "Material",
            values: ["Copper"],
          },
        ],
        applications: ["Industrial wiring", "Heavy duty applications"],
      },
      {
        name: "Aluminum Service Cable 16mm",
        slug: "aluminum-service-cable-16mm",
        about: "Service cable for overhead power lines",
        categoryId: aluminumCablesCategory._id,
        images: ["/assets/product.svg"],
        price: 89.99,
        parameters: [
          {
            label: "Size",
            values: ["16mm", "25mm", "35mm"],
          },
          {
            label: "Material",
            values: ["Aluminum"],
          },
        ],
        applications: ["Overhead lines", "Service connections"],
      },
      {
        name: "DOL Motor Starter 10HP",
        slug: "dol-motor-starter-10hp",
        about: "Direct Online motor starter for 10HP motors",
        categoryId: starterCategory._id,
        images: ["/assets/motor-starter.svg"],
        price: 1250.0,
        parameters: [
          {
            label: "Power Rating",
            values: ["10HP", "15HP", "20HP"],
          },
          {
            label: "Voltage",
            values: ["415V"],
          },
        ],
        applications: ["Industrial motors", "Pump applications"],
      },
      {
        name: "Submersible Flat Cable 3x2.5mm",
        slug: "submersible-flat-cable-3x2-5mm",
        about: "Flat cable for submersible pump applications",
        categoryId: submersibleCategory._id,
        images: ["/assets/product.svg"],
        price: 45.5,
        parameters: [
          {
            label: "Core Configuration",
            values: ["3x2.5mm", "3x4mm", "3x6mm"],
          },
          {
            label: "Type",
            values: ["Flat Cable"],
          },
        ],
        applications: ["Submersible pumps", "Underwater applications"],
      },
      {
        name: "Kit Kat Fuse 63A",
        slug: "kit-kat-fuse-63a",
        about: "High breaking capacity fuse for electrical protection",
        categoryId: fuseCategory._id,
        images: ["/assets/product.svg"],
        price: 25.0,
        parameters: [
          {
            label: "Current Rating",
            values: ["32A", "63A", "100A"],
          },
          {
            label: "Type",
            values: ["HRC Fuse"],
          },
        ],
        applications: ["Motor protection", "Circuit protection"],
      },
    ];

    await Product.insertMany(products);

    console.log("Sample data populated successfully!");
    console.log("Categories created:", await Category.countDocuments());
    console.log("Products created:", await Product.countDocuments());
  } catch (error) {
    console.error("Error populating sample data:", error);
  }
}

if (require.main === module) {
  populateSampleData().then(() => process.exit(0));
}

export default populateSampleData;
