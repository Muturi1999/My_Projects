import { DetailPageCMSData } from "@/lib/types/cms";

export const detailPageCMSData: DetailPageCMSData = {
  showSimilarProducts: true,
  similarProductsCount: 8,
  showSpecs: true,
  showReviews: true,
  showShippingInfo: true,
  ctaBlocks: [
    {
      id: "cta-1",
      title: "Need Help?",
      description: "Our support team is here to help you find the perfect product.",
      ctaLabel: "Contact Support",
      ctaHref: "/contact",
      order: 1,
    },
  ],
  seoSections: [
    {
      id: "seo-1",
      title: "Product Specifications",
      content: "Detailed specifications and technical information about our products.",
      order: 1,
    },
  ],
};



