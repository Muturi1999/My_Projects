/**
 * Export Mock Data to JSON
 * 
 * This script exports all mock data from TypeScript files to JSON format
 * for use in Django seeding commands.
 * 
 * Usage: npx ts-node frontend/scripts/export-mock-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import all mock data
import { 
  hotDeals, 
  laptopDeals, 
  printerDeals, 
  accessoriesDeals, 
  audioDeals,
  brandLaptops,
  featuredDeals 
} from '../lib/data/products';

import {
  shopCategories,
  popularCategories,
  popularBrands,
  brandSections
} from '../lib/data/categories';

// Try to import CMS data (may not exist)
let homepageCMSData: any = null;
let navigationData: any = null;
let footerData: any = null;
let serviceGuaranteesData: any = null;

try {
  const homepageModule = require('../lib/data/cms/homepage');
  homepageCMSData = homepageModule.homepageCMSData || homepageModule.default;
} catch (e: any) {
  console.warn('⚠️  Could not import homepage CMS data:', e?.message || String(e));
}

try {
  const navigationModule = require('../lib/data/cms/navigation');
  navigationData = navigationModule.navigationData || navigationModule.default;
} catch (e: any) {
  console.warn('⚠️  Could not import navigation data:', e?.message || String(e));
}

try {
  const footerModule = require('../lib/data/cms/footer');
  footerData = footerModule.footerData || footerModule.default;
} catch (e: any) {
  console.warn('⚠️  Could not import footer data:', e?.message || String(e));
}

try {
  const guaranteesModule = require('../lib/data/cms/serviceGuarantees');
  serviceGuaranteesData = guaranteesModule.serviceGuaranteesData || guaranteesModule.default;
} catch (e: any) {
  console.warn('⚠️  Could not import service guarantees data:', e?.message || String(e));
}

// Prepare export data
const exportData = {
  products: {
    hotDeals,
    laptopDeals,
    printerDeals,
    accessoriesDeals,
    audioDeals,
    brandLaptops,
    featuredDeals
  },
  catalog: {
    shopCategories,
    popularCategories,
    popularBrands,
    brandSections
  },
  cms: {
    homepage: homepageCMSData,
    navigation: navigationData,
    footer: footerData,
    serviceGuarantees: serviceGuaranteesData
  },
  metadata: {
    exportedAt: new Date().toISOString(),
    productCounts: {
      hotDeals: hotDeals.length,
      laptopDeals: laptopDeals.length,
      printerDeals: printerDeals.length,
      accessoriesDeals: accessoriesDeals.length,
      audioDeals: audioDeals.length,
      brandLaptops: Object.keys(brandLaptops).reduce((sum, key) => sum + brandLaptops[key].length, 0),
      featuredDeals: featuredDeals.length
    },
    catalogCounts: {
      shopCategories: shopCategories.length,
      popularCategories: popularCategories.length,
      popularBrands: popularBrands.length,
      brandSections: brandSections.length
    }
  }
};

// Create output directory
const outputDir = path.join(__dirname, '../../backend/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created directory: ${outputDir}`);
}

// Write to JSON file
const outputPath = path.join(outputDir, 'mock-data-export.json');
fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');

// Print summary
console.log('\n✅ Mock data exported successfully!');
console.log(`📄 Output file: ${outputPath}`);
console.log('\n📊 Summary:');
console.log(`   Products:`);
console.log(`     - Hot Deals: ${hotDeals.length}`);
console.log(`     - Laptop Deals: ${laptopDeals.length}`);
console.log(`     - Printer Deals: ${printerDeals.length}`);
console.log(`     - Accessories Deals: ${accessoriesDeals.length}`);
console.log(`     - Audio Deals: ${audioDeals.length}`);
console.log(`     - Brand Laptops: ${exportData.metadata.productCounts.brandLaptops}`);
console.log(`     - Featured Deals: ${featuredDeals.length}`);
console.log(`   Catalog:`);
console.log(`     - Shop Categories: ${shopCategories.length}`);
console.log(`     - Popular Categories: ${popularCategories.length}`);
console.log(`     - Popular Brands: ${popularBrands.length}`);
console.log(`     - Brand Sections: ${brandSections.length}`);
console.log(`\n🎯 Next step: Run Django seeding commands`);
console.log(`   cd backend/services/catalog && python manage.py seed_catalog`);
console.log(`   cd backend/services/products && python manage.py seed_products`);
console.log(`   cd backend/services/cms && python manage.py seed_cms`);

