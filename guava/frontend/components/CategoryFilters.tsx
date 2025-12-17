"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { categoryFilterConfigs } from "@/lib/data/categoryFilters";

interface CategoryFiltersProps {
  categorySlug: string;
  onFilterChange: (filters: any) => void;
}

export function CategoryFilters({ categorySlug, onFilterChange }: CategoryFiltersProps) {
  const config = categoryFilterConfigs[categorySlug] || categoryFilterConfigs["laptops-computers"];

  // Start with NO availability filter applied by default so that
  // the category page initially shows all products unfiltered.
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false,
  });
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  // Dynamic state for all filter types
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCpuTypes, setSelectedCpuTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedScreenSizes, setSelectedScreenSizes] = useState<string[]>([]);
  const [selectedCpuManufacturers, setSelectedCpuManufacturers] = useState<string[]>([]);
  const [selectedCpuSpeeds, setSelectedCpuSpeeds] = useState<string[]>([]);
  const [selectedGraphics, setSelectedGraphics] = useState<string[]>([]);
  const [selectedConnectivity, setSelectedConnectivity] = useState<string[]>([]);
  const [selectedCompatibility, setSelectedCompatibility] = useState<string[]>([]);
  const [selectedResolution, setSelectedResolution] = useState<string[]>([]);
  const [selectedRefreshRate, setSelectedRefreshRate] = useState<string[]>([]);
  const [selectedPanelType, setSelectedPanelType] = useState<string[]>([]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string[]>([]);
  const [selectedOperatingSystem, setSelectedOperatingSystem] = useState<string[]>([]);
  const [selectedPrinterType, setSelectedPrinterType] = useState<string[]>([]);
  const [selectedFunctionality, setSelectedFunctionality] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedProcessor, setSelectedProcessor] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedWifiStandard, setSelectedWifiStandard] = useState<string[]>([]);
  const [selectedSpeed, setSelectedSpeed] = useState<string[]>([]);
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
  const [selectedInterface, setSelectedInterface] = useState<string[]>([]);
  const [selectedConsoleType, setSelectedConsoleType] = useState<string[]>([]);

  // Update parent when filters change
  useEffect(() => {
    onFilterChange({
      availability,
      priceRange,
      brands: selectedBrands,
      types: selectedTypes,
      cpuTypes: selectedCpuTypes,
      generations: selectedGenerations,
      storage: selectedStorage,
      screenSizes: selectedScreenSizes,
      cpuManufacturers: selectedCpuManufacturers,
      cpuSpeeds: selectedCpuSpeeds,
      graphics: selectedGraphics,
      connectivity: selectedConnectivity,
      compatibility: selectedCompatibility,
      resolution: selectedResolution,
      refreshRate: selectedRefreshRate,
      panelType: selectedPanelType,
      ram: selectedRam,
      camera: selectedCamera,
      battery: selectedBattery,
      network: selectedNetwork,
      operatingSystem: selectedOperatingSystem,
      printerType: selectedPrinterType,
      functionality: selectedFunctionality,
      color: selectedColor,
      processor: selectedProcessor,
      features: selectedFeatures,
      wifiStandard: selectedWifiStandard,
      speed: selectedSpeed,
      ports: selectedPorts,
      license: selectedLicense,
      capacity: selectedCapacity,
      interface: selectedInterface,
      consoleType: selectedConsoleType,
    });
  }, [
    availability,
    priceRange,
    selectedBrands,
    selectedTypes,
    selectedCpuTypes,
    selectedGenerations,
    selectedStorage,
    selectedScreenSizes,
    selectedCpuManufacturers,
    selectedCpuSpeeds,
    selectedGraphics,
    selectedConnectivity,
    selectedCompatibility,
    selectedResolution,
    selectedRefreshRate,
    selectedPanelType,
    selectedRam,
    selectedCamera,
    selectedBattery,
    selectedNetwork,
    selectedOperatingSystem,
    selectedPrinterType,
    selectedFunctionality,
    selectedColor,
    selectedProcessor,
    selectedFeatures,
    selectedWifiStandard,
    selectedSpeed,
    selectedPorts,
    selectedLicense,
    selectedCapacity,
    selectedInterface,
    selectedConsoleType,
    onFilterChange,
  ]);

  const renderCheckboxGroup = (
    title: string,
    items: string[] | { name: string; count?: number; label?: string; value?: string }[],
    selected: string[],
    onToggle: (item: string) => void,
    maxHeight?: string
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <div>
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">{title}</h3>
        <div className={`space-y-1.5 sm:space-y-2 ${maxHeight ? maxHeight + " overflow-y-auto" : ""}`}>
          {items.map((item) => {
            const itemName = typeof item === "string" ? item : item.name || item.label || "";
            const itemValue = typeof item === "string" ? item : item.value || item.name || "";
            const count = typeof item === "object" && "count" in item ? item.count : undefined;

            return (
              <div key={itemValue} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${itemValue}`}
                  checked={selected.includes(itemValue)}
                  onCheckedChange={() => onToggle(itemValue)}
                />
                <Label
                  htmlFor={`${title}-${itemValue}`}
                  className="text-xs sm:text-sm font-normal cursor-pointer flex-1"
                >
                  {itemName}
                  {count !== undefined && <span className="text-gray-500"> ({count})</span>}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-64 space-y-4 sm:space-y-6 pr-0 sm:pr-4">
      {/* Availability */}
      {config.availability && (
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">AVAILABILITY</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={availability.inStock}
                onCheckedChange={(checked) =>
                  setAvailability((prev) => ({ ...prev, inStock: !!checked }))
                }
              />
              <Label htmlFor="in-stock" className="text-xs sm:text-sm font-normal cursor-pointer">
                In stock <span className="text-gray-500">(1,200)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="out-of-stock"
                checked={availability.outOfStock}
                onCheckedChange={(checked) =>
                  setAvailability((prev) => ({ ...prev, outOfStock: !!checked }))
                }
              />
              <Label htmlFor="out-of-stock" className="text-xs sm:text-sm font-normal cursor-pointer">
                Out of stock <span className="text-gray-500">(25)</span>
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Price Range */}
      {config.priceRange && (
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">PRICE RANGE</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Min price</span>
              <span className="font-medium">Ksh {(priceRange[0] * 1000).toLocaleString()}</span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={500}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Max price</span>
              <span className="font-medium">
                Ksh {priceRange[1] === 500 ? "500,000+" : (priceRange[1] * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Brand */}
      {config.brands && renderCheckboxGroup(
        "BRAND",
        config.brands,
        selectedBrands,
        (brand) =>
          setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
          ),
        "max-h-60"
      )}

      {/* Types */}
      {config.types && renderCheckboxGroup(
        "BY TYPE",
        config.types,
        selectedTypes,
        (type) =>
          setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
          )
      )}

      {/* CPU Type */}
      {config.cpuTypes && renderCheckboxGroup(
        "CPU TYPE",
        config.cpuTypes,
        selectedCpuTypes,
        (cpu) =>
          setSelectedCpuTypes((prev) =>
            prev.includes(cpu) ? prev.filter((c) => c !== cpu) : [...prev, cpu]
          ),
        "max-h-48"
      )}

      {/* Generation */}
      {config.generations && renderCheckboxGroup(
        "GENERATION",
        config.generations,
        selectedGenerations,
        (gen) =>
          setSelectedGenerations((prev) =>
            prev.includes(gen) ? prev.filter((g) => g !== gen) : [...prev, gen]
          ),
        "max-h-48"
      )}

      {/* Storage */}
      {config.storage && renderCheckboxGroup(
        "STORAGE",
        config.storage,
        selectedStorage,
        (storage) =>
          setSelectedStorage((prev) =>
            prev.includes(storage) ? prev.filter((s) => s !== storage) : [...prev, storage]
          )
      )}

      {/* Screen Size */}
      {config.screenSizes && renderCheckboxGroup(
        "SCREEN SIZE",
        config.screenSizes,
        selectedScreenSizes,
        (size) =>
          setSelectedScreenSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
          )
      )}

      {/* CPU Manufacturer */}
      {config.cpuManufacturers && renderCheckboxGroup(
        "CPU MANUFACTURER",
        config.cpuManufacturers,
        selectedCpuManufacturers,
        (man) =>
          setSelectedCpuManufacturers((prev) =>
            prev.includes(man) ? prev.filter((m) => m !== man) : [...prev, man]
          )
      )}

      {/* CPU Speed */}
      {config.cpuSpeeds && renderCheckboxGroup(
        "CPU SPEED",
        config.cpuSpeeds,
        selectedCpuSpeeds,
        (speed) =>
          setSelectedCpuSpeeds((prev) =>
            prev.includes(speed) ? prev.filter((s) => s !== speed) : [...prev, speed]
          )
      )}

      {/* Dedicated Graphics */}
      {config.graphics && renderCheckboxGroup(
        "DEDICATED GRAPHICS",
        config.graphics,
        selectedGraphics,
        (graphics) =>
          setSelectedGraphics((prev) =>
            prev.includes(graphics) ? prev.filter((g) => g !== graphics) : [...prev, graphics]
          )
      )}

      {/* Connectivity */}
      {config.connectivity && renderCheckboxGroup(
        "CONNECTIVITY",
        config.connectivity,
        selectedConnectivity,
        (conn) =>
          setSelectedConnectivity((prev) =>
            prev.includes(conn) ? prev.filter((c) => c !== conn) : [...prev, conn]
          )
      )}

      {/* Compatibility */}
      {config.compatibility && renderCheckboxGroup(
        "COMPATIBILITY",
        config.compatibility,
        selectedCompatibility,
        (comp) =>
          setSelectedCompatibility((prev) =>
            prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
          )
      )}

      {/* Resolution */}
      {config.resolution && renderCheckboxGroup(
        "RESOLUTION",
        config.resolution,
        selectedResolution,
        (res) =>
          setSelectedResolution((prev) =>
            prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res]
          )
      )}

      {/* Refresh Rate */}
      {config.refreshRate && renderCheckboxGroup(
        "REFRESH RATE",
        config.refreshRate,
        selectedRefreshRate,
        (rate) =>
          setSelectedRefreshRate((prev) =>
            prev.includes(rate) ? prev.filter((r) => r !== rate) : [...prev, rate]
          )
      )}

      {/* Panel Type */}
      {config.panelType && renderCheckboxGroup(
        "PANEL TYPE",
        config.panelType,
        selectedPanelType,
        (panel) =>
          setSelectedPanelType((prev) =>
            prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
          )
      )}

      {/* RAM */}
      {config.ram && renderCheckboxGroup(
        "RAM",
        config.ram,
        selectedRam,
        (ram) =>
          setSelectedRam((prev) =>
            prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
          )
      )}

      {/* Camera */}
      {config.camera && renderCheckboxGroup(
        "CAMERA",
        config.camera,
        selectedCamera,
        (camera) =>
          setSelectedCamera((prev) =>
            prev.includes(camera) ? prev.filter((c) => c !== camera) : [...prev, camera]
          )
      )}

      {/* Battery */}
      {config.battery && renderCheckboxGroup(
        "BATTERY",
        config.battery,
        selectedBattery,
        (battery) =>
          setSelectedBattery((prev) =>
            prev.includes(battery) ? prev.filter((b) => b !== battery) : [...prev, battery]
          )
      )}

      {/* Network */}
      {config.network && renderCheckboxGroup(
        "NETWORK",
        config.network,
        selectedNetwork,
        (network) =>
          setSelectedNetwork((prev) =>
            prev.includes(network) ? prev.filter((n) => n !== network) : [...prev, network]
          )
      )}

      {/* Operating System */}
      {config.operatingSystem && renderCheckboxGroup(
        "OPERATING SYSTEM",
        config.operatingSystem,
        selectedOperatingSystem,
        (os) =>
          setSelectedOperatingSystem((prev) =>
            prev.includes(os) ? prev.filter((o) => o !== os) : [...prev, os]
          )
      )}

      {/* Printer Type */}
      {config.printerType && renderCheckboxGroup(
        "PRINTER TYPE",
        config.printerType,
        selectedPrinterType,
        (type) =>
          setSelectedPrinterType((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
          )
      )}

      {/* Functionality */}
      {config.functionality && renderCheckboxGroup(
        "FUNCTIONALITY",
        config.functionality,
        selectedFunctionality,
        (func) =>
          setSelectedFunctionality((prev) =>
            prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
          )
      )}

      {/* Color */}
      {config.color && renderCheckboxGroup(
        "COLOR",
        config.color,
        selectedColor,
        (color) =>
          setSelectedColor((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
          )
      )}

      {/* Processor */}
      {config.processor && renderCheckboxGroup(
        "PROCESSOR",
        config.processor,
        selectedProcessor,
        (proc) =>
          setSelectedProcessor((prev) =>
            prev.includes(proc) ? prev.filter((p) => p !== proc) : [...prev, proc]
          )
      )}

      {/* Features */}
      {config.features && renderCheckboxGroup(
        "FEATURES",
        config.features,
        selectedFeatures,
        (feature) =>
          setSelectedFeatures((prev) =>
            prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
          )
      )}

      {/* WiFi Standard */}
      {config.wifiStandard && renderCheckboxGroup(
        "WI-FI STANDARD",
        config.wifiStandard,
        selectedWifiStandard,
        (standard) =>
          setSelectedWifiStandard((prev) =>
            prev.includes(standard) ? prev.filter((s) => s !== standard) : [...prev, standard]
          )
      )}

      {/* Speed */}
      {config.speed && renderCheckboxGroup(
        "SPEED",
        config.speed,
        selectedSpeed,
        (speed) =>
          setSelectedSpeed((prev) =>
            prev.includes(speed) ? prev.filter((s) => s !== speed) : [...prev, speed]
          )
      )}

      {/* Ports */}
      {config.ports && renderCheckboxGroup(
        "PORTS",
        config.ports,
        selectedPorts,
        (port) =>
          setSelectedPorts((prev) =>
            prev.includes(port) ? prev.filter((p) => p !== port) : [...prev, port]
          )
      )}

      {/* License */}
      {config.license && renderCheckboxGroup(
        "LICENSE",
        config.license,
        selectedLicense,
        (license) =>
          setSelectedLicense((prev) =>
            prev.includes(license) ? prev.filter((l) => l !== license) : [...prev, license]
          )
      )}

      {/* Capacity */}
      {config.capacity && renderCheckboxGroup(
        "CAPACITY",
        config.capacity,
        selectedCapacity,
        (capacity) =>
          setSelectedCapacity((prev) =>
            prev.includes(capacity) ? prev.filter((c) => c !== capacity) : [...prev, capacity]
          )
      )}

      {/* Interface */}
      {config.interface && renderCheckboxGroup(
        "INTERFACE",
        config.interface,
        selectedInterface,
        (intf) =>
          setSelectedInterface((prev) =>
            prev.includes(intf) ? prev.filter((i) => i !== intf) : [...prev, intf]
          )
      )}

      {/* Console Type */}
      {config.consoleType && renderCheckboxGroup(
        "CONSOLE TYPE",
        config.consoleType,
        selectedConsoleType,
        (console) =>
          setSelectedConsoleType((prev) =>
            prev.includes(console) ? prev.filter((c) => c !== console) : [...prev, console]
          )
      )}
    </div>
  );
}
