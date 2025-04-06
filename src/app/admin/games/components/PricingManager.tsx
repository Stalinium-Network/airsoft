"use client";

import { useState } from "react";
import { PricePeriod } from "@/services/gameService";
import { formatDateTime } from "@/utils/time-format";

interface PricingManagerProps {
  pricePeriods: PricePeriod[];
  onChange: (periods: PricePeriod[]) => void;
  disabled?: boolean;
}

export default function PricingManager({
  pricePeriods = [],
  onChange,
  disabled = false,
}: PricingManagerProps) {
  const [error, setError] = useState<string | null>(null);

  const handlePeriodChange = (
    index: number,
    field: keyof PricePeriod,
    value: string | number
  ) => {
    const updatedPeriods = [...pricePeriods];
    updatedPeriods[index] = {
      ...updatedPeriods[index],
      [field]: field === "price" ? Number(value) : value,
    };

    // If we change the start date for a non-first price,
    // we need to update the end date of the previous period
    if (field === "starts" && index > 0) {
      updatedPeriods[index - 1] = {
        ...updatedPeriods[index - 1],
        ends: value as string,
      };
    }

    // If this is not the last price and we change the end date,
    // also update the start date for the next period
    if (field === "ends" && index < updatedPeriods.length - 1) {
      updatedPeriods[index + 1] = {
        ...updatedPeriods[index + 1],
        starts: value as string,
      };
    }

    onChange(updatedPeriods);
    validatePeriods(updatedPeriods);
  };

  const addPeriod = () => {
    // Determine start date for the new period
    let defaultStart: string;

    if (pricePeriods.length === 0) {
      // If no periods yet, start with current date
      defaultStart = new Date().toISOString();
    } else {
      // If the last period has an end date, use it
      // otherwise add 7 days to the start date of the last period
      const lastPeriod = pricePeriods[pricePeriods.length - 1];

      if (lastPeriod.ends) {
        defaultStart = lastPeriod.ends;
      } else {
        const lastStart = new Date(lastPeriod.starts);
        lastStart.setDate(lastStart.getDate() + 7);
        defaultStart = lastStart.toISOString();

        // Update the end date of previous period
        const updatedPeriods = [...pricePeriods];
        updatedPeriods[pricePeriods.length - 1] = {
          ...lastPeriod,
          ends: defaultStart,
        };

        // Update existing periods
        onChange(updatedPeriods);
      }
    }

    const newPeriod: PricePeriod = {
      starts: defaultStart,
      price:
        pricePeriods.length > 0
          ? pricePeriods[pricePeriods.length - 1].price + 5 // Add a bit to the previous price
          : 20, // Default value
    };

    const updatedPeriods = [...pricePeriods, newPeriod];
    onChange(updatedPeriods);
    validatePeriods(updatedPeriods);
  };

  const removePeriod = (index: number) => {
    const updatedPeriods = pricePeriods.filter((_, i) => i !== index);

    // If we're not removing the last period, we need to update dates for neighboring periods
    if (
      index < pricePeriods.length - 1 &&
      index > 0 &&
      updatedPeriods.length > 1
    ) {
      updatedPeriods[index - 1] = {
        ...updatedPeriods[index - 1],
        ends: pricePeriods[index + 1].starts,
      };
    }

    onChange(updatedPeriods);
    validatePeriods(updatedPeriods);
  };

  // Price periods validation
  const validatePeriods = (periods: PricePeriod[]) => {
    if (periods.length === 0) {
      setError(null);
      return;
    }

    // Check for negative prices
    const hasNegativePrice = periods.some((period) => period.price < 0);
    if (hasNegativePrice) {
      setError("Price cannot be negative");
      return;
    }

    // Check for correct date sequence
    for (let i = 0; i < periods.length - 1; i++) {
      const currentPeriod = periods[i];
      const nextPeriod = periods[i + 1];

      if (!currentPeriod.ends) {
        setError(`Period ${i + 1} must have an end date`);
        return;
      }

      if (new Date(currentPeriod.ends) > new Date(nextPeriod.starts)) {
        setError(`Period ${i + 1} ends after the start of period ${i + 2}`);
        return;
      }

      if (new Date(currentPeriod.starts) >= new Date(currentPeriod.ends)) {
        setError(`Period ${i + 1}: start date must be earlier than end date`);
        return;
      }
    }

    // Check for the last period if it has an end date
    const lastPeriod = periods[periods.length - 1];
    if (
      lastPeriod.ends &&
      new Date(lastPeriod.starts) >= new Date(lastPeriod.ends)
    ) {
      setError(`Last period: start date must be earlier than end date`);
      return;
    }

    setError(null);
  };

  // Create new price between current and previous
  const addPriceBetween = (index: number) => {
    // If this is the first element, just add to the beginning
    if (index === 0) {
      const currentDate = new Date();
      const firstPeriodStart = new Date(pricePeriods[0].starts);

      // Choose midpoint between current date and start of first period
      const startDate = new Date(
        (currentDate.getTime() + firstPeriodStart.getTime()) / 2
      );

      const newPeriod: PricePeriod = {
        starts: startDate.toISOString(),
        ends: pricePeriods[0].starts,
        price: pricePeriods[0].price - 5,
      };

      const updatedPeriods = [newPeriod, ...pricePeriods];
      onChange(updatedPeriods);
      validatePeriods(updatedPeriods);
      return;
    }

    // Insert between two existing periods
    const prevPeriod = pricePeriods[index - 1];
    const currentPeriod = pricePeriods[index];

    // Find midpoint between end of previous and start of current
    const prevEnd = new Date(prevPeriod.ends || prevPeriod.starts);
    const currentStart = new Date(currentPeriod.starts);
    const midDate = new Date((prevEnd.getTime() + currentStart.getTime()) / 2);

    // Average price
    const midPrice = Math.round((prevPeriod.price + currentPeriod.price) / 2);

    const newPeriod: PricePeriod = {
      starts: midDate.toISOString(),
      ends: currentPeriod.starts,
      price: midPrice,
    };

    // Update end date of previous period
    const updatedPrevPeriod = {
      ...prevPeriod,
      ends: midDate.toISOString(),
    };

    // Build updated periods array
    const updatedPeriods = [...pricePeriods];
    updatedPeriods[index - 1] = updatedPrevPeriod;
    updatedPeriods.splice(index, 0, newPeriod);

    onChange(updatedPeriods);
    validatePeriods(updatedPeriods);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-medium text-amber-400">Dynamic Pricing</h4>

        <button
          type="button"
          onClick={addPeriod}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm flex items-center transition-colors"
          disabled={disabled}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Period
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {pricePeriods.length === 0 ? (
        <div className="text-gray-400 text-center p-6 bg-gray-750 border border-gray-700 rounded-lg">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg mb-2">No price periods</p>
          <p className="text-sm">
            Add the first price period to begin setting up dynamic pricing
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {pricePeriods.map((period, index) => {
            const isLastPeriod = index === pricePeriods.length - 1;
            const isFirstPeriod = index === 0;

            return (
              <div key={`price-period-${index}`} className="relative">
                {/* Button to add period between existing ones */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => addPriceBetween(index)}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 bg-gray-700 hover:bg-gray-600 text-amber-400 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                    title="Add period between"
                    disabled={disabled}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                )}

                <div
                  className={`flex flex-col md:flex-row bg-gray-750 p-4 border rounded-lg transition-all ${
                    isLastPeriod
                      ? "border-amber-500/50 shadow-lg shadow-amber-900/10"
                      : "border-gray-700"
                  }`}
                >
                  <div className="flex-1 space-y-2 mb-3 md:mb-0 md:mr-4">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          {isFirstPeriod
                            ? "Sales Start"
                            : "Next Price Transition"}
                        </label>
                        <input
                          type="datetime-local"
                          value={period.starts.substring(0, 16)}
                          onChange={(e) =>
                            handlePeriodChange(index, "starts", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          disabled={disabled}
                        />
                      </div>

                      {/* End date only for the last period */}
                      {isLastPeriod && (
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Sales End (optional)
                          </label>
                          <input
                            type="datetime-local"
                            value={
                              period.ends ? period.ends.substring(0, 16) : ""
                            }
                            onChange={(e) =>
                              handlePeriodChange(index, "ends", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            disabled={disabled}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-end">
                      <div className="w-full">
                        <div className="flex justify-between">
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Price ({isLastPeriod ? "current" : "early bird"})
                          </label>
                          <span className="text-xs text-amber-400 font-medium">
                            {isLastPeriod
                              ? "Current Price"
                              : `Phase ${index + 1}`}
                          </span>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">$</span>
                          </div>
                          <input
                            type="number"
                            value={period.price}
                            onChange={(e) =>
                              handlePeriodChange(index, "price", e.target.value)
                            }
                            min="0"
                            className="w-full pl-8 pr-12 py-2 bg-gray-900 border border-gray-700 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            disabled={disabled}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">USD</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePeriod(index)}
                        className="px-3 py-2 ml-3 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm flex items-center transition-colors"
                        disabled={disabled || pricePeriods.length === 1}
                        title={
                          pricePeriods.length === 1
                            ? "At least one price period is required"
                            : "Remove period"
                        }
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-sm text-gray-400 bg-gray-800/50 p-4 rounded border border-gray-700">
        <div className="flex items-start mb-2">
          <svg
            className="w-5 h-5 mr-2 text-amber-500 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-amber-400 font-medium">Note:</span>
        </div>
        <p className="pl-7">
          Registration period is automatically determined by price periods.
          Registration opens with the first period and closes at the end of the
          last period. To set up early bird discount periods, add multiple
          periods with increasing prices.
        </p>
      </div>
    </div>
  );
}
