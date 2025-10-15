import dotenv from "dotenv";
import { connectDB } from "../lib/mongoose";
import Blog from "../models/Blog";

// Load environment variables
dotenv.config({ path: ".env.local" });

const sampleBlogs = [
  {
    title: "What Are Biomass Briquettes",
    slug: "what-are-biomass-briquettes",
    description:
      "Biomass briquettes are cylindrical blocks made from organic materials like agricultural residue, forestry waste, or organic industrial by-products.",
    content: `# Introduction

Biomass briquettes are cylindrical blocks made from organic materials like agricultural residue, forestry waste, or organic industrial by-products. They are manufactured by compressing these materials at high pressure to create a dense, compact fuel source.

## The Briquetting Process

The production of biomass briquettes involves several stages:

1. **Collection of Biomass Material:** Raw materials like agricultural waste are collected
2. **Drying:** Moisture content is reduced to below 10%
3. **Compression:** Materials are compressed under high pressure
4. **Cooling and Packaging:** Briquettes are cooled and packaged

## Benefits of Biomass Briquettes

### Environmental Benefits
- Reduced carbon emissions
- Reduced deforestation
- Waste utilization

### Economic Benefits
- Cost-effective fuel source
- Job creation opportunities

### Energy Efficiency
- High energy density
- Longer burning time`,
    image: "https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf",
    readTime: "5",
    isPublished: true,
    tags: ["Biomass", "Sustainable Energy", "Environment"],
  },
  {
    title: "Fueling India's Green Future",
    slug: "fueling-india-green-future",
    description:
      "India is increasingly turning towards sustainable alternatives like biomass briquettes, supported by government policies and initiatives.",
    content: `# Fueling India's Green Future

India, a nation grappling with energy security and environmental concerns, is increasingly turning towards sustainable alternatives. One such promising solution is biomass briquettes.

## Understanding Biomass Briquettes

Biomass briquettes are compressed blocks of agricultural waste, such as:
- Rice husks
- Sugarcane bagasse
- Wood shavings

## Government Initiatives

The Indian government has implemented several policies:

### MNRE Programs
- National Bioenergy Programme
- Biomass Programme

### State-Level Policies
- Subsidies and tax breaks
- Awareness campaigns

### Clean Cooking Initiatives
- Pradhan Mantri Ujjwala Yojana
- Rural household support programs`,
    image: "https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf",
    readTime: "7",
    isPublished: true,
    tags: ["India", "Government Policy", "Clean Energy"],
  },
  {
    title: "Agricultural Equipment Maintenance Tips",
    slug: "agricultural-equipment-maintenance-tips",
    description:
      "Essential maintenance tips to keep your agricultural equipment running efficiently and extend its lifespan.",
    content: `# Agricultural Equipment Maintenance Tips

Proper maintenance of agricultural equipment is crucial for:
- Maximizing efficiency
- Extending equipment life
- Reducing downtime
- Ensuring safety

## Regular Inspection Checklist

### Daily Checks
- Oil levels
- Coolant levels
- Tire pressure
- Visual inspection for damage

### Weekly Maintenance
- Clean air filters
- Check battery connections
- Inspect belts and hoses
- Lubricate moving parts

### Monthly Tasks
- Change engine oil
- Inspect hydraulic systems
- Check electrical systems
- Test safety features

## Seasonal Maintenance

Prepare your equipment for each season with specific maintenance routines tailored to seasonal demands.`,
    image: "https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf",
    readTime: "6",
    isPublished: true,
    tags: ["Agriculture", "Maintenance", "Equipment"],
  },
];

async function populateSampleBlogs() {
  try {
    await connectDB();

    // Clear existing blogs
    await Blog.deleteMany({});

    // Insert sample blogs
    await Blog.insertMany(sampleBlogs);

    console.log("Sample blogs populated successfully!");
    console.log(`Inserted ${sampleBlogs.length} blog posts`);

    process.exit(0);
  } catch (error) {
    console.error("Error populating sample blogs:", error);
    process.exit(1);
  }
}

// Run the script
populateSampleBlogs();

export default populateSampleBlogs;
