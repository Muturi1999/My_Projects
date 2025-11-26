"use client";

import { useSearchParams } from "next/navigation";
import { CMSTabs } from "@/components/admin/cms/CMSTabs";
import { HomepageTab } from "@/components/admin/cms/tabs/HomepageTab";
import { NavigationTab } from "@/components/admin/cms/tabs/NavigationTab";
import { HeroTab } from "@/components/admin/cms/tabs/HeroTab";
import { CategoriesTab } from "@/components/admin/cms/tabs/CategoriesTab";
import { ShopTab } from "@/components/admin/cms/tabs/ShopTab";
import { DetailTab } from "@/components/admin/cms/tabs/DetailTab";
import { FooterTab } from "@/components/admin/cms/tabs/FooterTab";
import { CustomTab } from "@/components/admin/cms/tabs/CustomTab";
import { PageHeader } from "@/components/admin/PageHeader";

export default function CMSHubPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "homepage";

  const renderTabContent = () => {
    switch (activeTab) {
      case "homepage":
        return <HomepageTab />;
      case "navigation":
        return <NavigationTab />;
      case "hero":
        return <HeroTab />;
      case "categories":
        return <CategoriesTab />;
      case "shop":
        return <ShopTab />;
      case "detail":
        return <DetailTab />;
      case "footer":
        return <FooterTab />;
      case "custom":
        return <CustomTab />;
      default:
        return <HomepageTab />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Content Management"
        description="Manage all content sections, navigation, and page configurations"
      />
      <CMSTabs activeTab={activeTab} />
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
}



