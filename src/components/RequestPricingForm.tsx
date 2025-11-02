"use client";

import { useState } from "react";
import { ProductParameter } from "@/types/product";

interface RequestPricingFormProps {
  productName: string;
  parameters: ProductParameter[];
  onSubmit: (data: {
    selectedOptions: { [key: string]: string };
    contact: string;
    message: string;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const RequestPricingForm = ({
  productName,
  parameters,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RequestPricingFormProps) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOptionSelect = (label: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [label]: value,
    }));
    // Clear error for this field when user selects an option
    if (errors[label]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[label];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Check if all parameters have a selected option
    parameters.forEach((param) => {
      if (!selectedOptions[param.label]) {
        newErrors[param.label] = `Please select a ${param.label.toLowerCase()}`;
      }
    });

    // Validate contact field (email or phone number)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const isEmail = emailRegex.test(contact);
    const isPhone = /^[0-9+\-\s()]{10,}$/.test(contact.trim());

    if (!contact.trim()) {
      newErrors.contact = "Please enter your email or contact number";
    } else if (!isEmail && !isPhone) {
      newErrors.contact =
        "Please enter a valid email address or contact number";
    }

    if (!message.trim()) {
      newErrors.message = "Please enter a message";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        selectedOptions,
        contact,
        message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Product</h4>
        <p className="text-lg font-semibold text-gray-900">{productName}</p>
      </div>

      {/* Parameter Selection */}
      {parameters.map((param, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {param.label} <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {param.values.map((value, valueIndex) => (
              <button
                key={valueIndex}
                type="button"
                onClick={() => handleOptionSelect(param.label, value)}
                className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors
                  ${
                    selectedOptions[param.label] === value
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
                  }
                `}
              >
                {value}
              </button>
            ))}
          </div>
          {errors[param.label] && (
            <p className="mt-1 text-sm text-red-600">{errors[param.label]}</p>
          )}
        </div>
      ))}

      {/* Contact Input */}
      <div>
        <label
          htmlFor="contact"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email or Contact No <span className="text-red-500">*</span>
        </label>
        <input
          id="contact"
          type="text"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            if (errors.contact) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.contact;
                return newErrors;
              });
            }
          }}
          placeholder="someone@example.com or +91 9876543210"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        {errors.contact && (
          <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
        )}
      </div>

      {/* Message Input */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.message;
                return newErrors;
              });
            }
          }}
          placeholder="Please provide details about your requirements..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="hidden md:block flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Request"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="md:hidden flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default RequestPricingForm;
