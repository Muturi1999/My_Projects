import { homepageCMSData } from "@/lib/data/cms/homepage";
import { taxonomyCMSData } from "@/lib/data/cms/taxonomy";
import { navigationCMSData } from "@/lib/data/cms/navigation";
import { footerCMSData } from "@/lib/data/cms/footer";
import { shopPageCMSData } from "@/lib/data/cms/shopPage";
import { detailPageCMSData } from "@/lib/data/cms/detailPage";
import { serviceGuaranteesCMSData } from "@/lib/data/cms/serviceGuarantees";
import {
  HomepageCMSData,
  NavigationCMSData,
  FooterCMSData,
  ShopPageCMSData,
  DetailPageCMSData,
  ServiceGuaranteesCMSData,
  CustomSectionsCMSData,
} from "@/lib/types/cms";
import { TaxonomyCMSData } from "@/lib/types/taxonomy";

let homepageState: HomepageCMSData = JSON.parse(JSON.stringify(homepageCMSData));
let taxonomyState: TaxonomyCMSData = JSON.parse(JSON.stringify(taxonomyCMSData));
let navigationState: NavigationCMSData = JSON.parse(JSON.stringify(navigationCMSData));
let footerState: FooterCMSData = JSON.parse(JSON.stringify(footerCMSData));
let shopPageState: ShopPageCMSData = JSON.parse(JSON.stringify(shopPageCMSData));
let detailPageState: DetailPageCMSData = JSON.parse(JSON.stringify(detailPageCMSData));
let serviceGuaranteesState: ServiceGuaranteesCMSData = JSON.parse(JSON.stringify(serviceGuaranteesCMSData));
let customSectionsState: CustomSectionsCMSData = { sections: [] };

// Homepage
export function getHomepageCMS(): HomepageCMSData {
  return homepageState;
}

export function updateHomepageCMS(data: HomepageCMSData) {
  console.log("CMS Store: updateHomepageCMS called with data:", {
    heroSlides: data.heroSlides?.length || 0,
    shopByCategory: data.shopByCategory?.items?.length || 0,
    hotDeals: data.hotDeals?.items?.length || 0,
    printerScanner: data.printerScanner?.items?.length || 0,
    accessories: data.accessories?.items?.length || 0,
    audio: data.audio?.items?.length || 0,
    popularBrands: data.popularBrands?.items?.length || 0,
    popularCategories: data.popularCategories?.items?.length || 0,
  });
  homepageState = data;
  console.log("CMS Store: homepageState updated successfully");
}

// Taxonomy
export function getTaxonomyCMS(): TaxonomyCMSData {
  return taxonomyState;
}

export function updateTaxonomyCMS(data: TaxonomyCMSData) {
  taxonomyState = data;
}

// Navigation
export function getNavigationCMS(): NavigationCMSData {
  return navigationState;
}

export function updateNavigationCMS(data: NavigationCMSData) {
  navigationState = data;
}

// Footer
export function getFooterCMS(): FooterCMSData {
  return footerState;
}

export function updateFooterCMS(data: FooterCMSData) {
  footerState = data;
}

// Shop Page
export function getShopPageCMS(): ShopPageCMSData {
  return shopPageState;
}

export function updateShopPageCMS(data: ShopPageCMSData) {
  shopPageState = data;
}

// Detail Page
export function getDetailPageCMS(): DetailPageCMSData {
  return detailPageState;
}

export function updateDetailPageCMS(data: DetailPageCMSData) {
  detailPageState = data;
}

// Service Guarantees
export function getServiceGuaranteesCMS(): ServiceGuaranteesCMSData {
  return serviceGuaranteesState;
}

export function updateServiceGuaranteesCMS(data: ServiceGuaranteesCMSData) {
  serviceGuaranteesState = data;
}

// Custom Sections
export function getCustomSectionsCMS(): CustomSectionsCMSData {
  return customSectionsState;
}

export function updateCustomSectionsCMS(data: CustomSectionsCMSData) {
  customSectionsState = data;
}

