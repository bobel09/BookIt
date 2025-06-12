"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface ItinerarySearchParamsHandlerProps {
  destinationInput: string;
  setDestinationInput: (val: string) => void;
  setDestinationSearch: (val: string) => void;
  setDestinationOption: (val: any) => void;
  setToAirport: (val: any) => void;
}

export default function ItinerarySearchParamsHandler({
  destinationInput,
  setDestinationInput,
  setDestinationSearch,
  setDestinationOption,
  setToAirport,
}: ItinerarySearchParamsHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const destinationFromSearch = searchParams.get("destination");
    // Only set state if the URL param is non-empty and different from the current state
    if (destinationFromSearch && destinationInput !== destinationFromSearch) {
      setDestinationInput(destinationFromSearch);
      setDestinationSearch(destinationFromSearch);
      setDestinationOption(null);
      setToAirport(null);
    }
    // If the URL param is empty and the state is not, clear the state
    if (!destinationFromSearch && destinationInput) {
      setDestinationInput("");
      setDestinationSearch("");
      setDestinationOption(null);
      setToAirport(null);
    }
  }, [
    searchParams,
    destinationInput,
    setDestinationInput,
    setDestinationSearch,
    setDestinationOption,
    setToAirport,
  ]);

  return null;
}
