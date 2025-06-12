"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchFlightDetailsParamsHandlerProps {
  setToken: (token: string) => void;
  setCurrency: (currency: string) => void;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setAdults: (adults: string) => void;
  setTravelClass: (cls: string) => void;
  setNonStop: (nonStop: string) => void;
}

const SearchFlightDetailsParamsHandler = ({
  setToken,
  setCurrency,
  setFrom,
  setTo,
  setDepartureDate,
  setReturnDate,
  setAdults,
  setTravelClass,
  setNonStop,
}: SearchFlightDetailsParamsHandlerProps) => {
  const params = useSearchParams();
  useEffect(() => {
    setToken(params.get("token") || "");
    setCurrency(params.get("currency") || "");
    setFrom(params.get("from") || "");
    setTo(params.get("to") || "");
    setDepartureDate(params.get("departure_date") || "");
    setReturnDate(params.get("return_date") || "");
    setAdults(params.get("adults") || "");
    setTravelClass(params.get("travel_class") || "");
    setNonStop(params.get("non_stop") || "");
  }, [params]);
  return null;
};

export default SearchFlightDetailsParamsHandler;
