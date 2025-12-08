"use client";

import { useState } from "react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

interface Address {
  id?: string;
  label: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  isDefault: boolean;
}

export function ProfileWizard({ isOpen, onClose }: ProfileWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });
  const [addresses, setAddresses] = useState<Address[]>([
    {
      label: "Home",
      street: "",
      city: "",
      county: "",
      postalCode: "",
      isDefault: true,
    },
  ]);

  if (!isOpen) return null;

  const handlePersonalDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save personal details
    console.log("Save personal details:", personalDetails);
    setStep(2);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save addresses
    console.log("Save addresses:", addresses);
    alert("Profile updated successfully!");
    onClose();
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        label: "",
        street: "",
        city: "",
        county: "",
        postalCode: "",
        isDefault: false,
      },
    ]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  const updateAddress = (index: number, field: keyof Address, value: string | boolean) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {step} of 2: {step === 1 ? "Personal Details" : "Addresses"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 1 ? "bg-red-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 2 ? "bg-red-600" : "bg-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handlePersonalDetailsSubmit} className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={personalDetails.firstName}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        firstName: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={personalDetails.lastName}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        lastName: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      email: e.target.value,
                    })
                  }
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalDetails.phone}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      phone: e.target.value,
                    })
                  }
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalDetails.dateOfBirth}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      dateOfBirth: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 px-6">
                  Next: Addresses
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddressSubmit} className="space-y-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Addresses</h3>
                <button
                  type="button"
                  onClick={addAddress}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  + Add Address
                </button>
              </div>

              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Input
                      type="text"
                      value={address.label}
                      onChange={(e) =>
                        updateAddress(index, "label", e.target.value)
                      }
                      placeholder="Address label (e.g., Home, Work)"
                      className="max-w-xs"
                    />
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAddress(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <Input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        updateAddress(index, "street", e.target.value)
                      }
                      required
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <Input
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                          updateAddress(index, "city", e.target.value)
                        }
                        required
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        County
                      </label>
                      <Input
                        type="text"
                        value={address.county}
                        onChange={(e) =>
                          updateAddress(index, "county", e.target.value)
                        }
                        required
                        placeholder="Enter county"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) =>
                        updateAddress(index, "postalCode", e.target.value)
                      }
                      required
                      placeholder="Enter postal code"
                    />
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={address.isDefault}
                      onChange={(e) =>
                        updateAddress(index, "isDefault", e.target.checked)
                      }
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Set as default address</span>
                  </label>
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="px-6"
                >
                  Back
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 px-6">
                  Save Profile
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

