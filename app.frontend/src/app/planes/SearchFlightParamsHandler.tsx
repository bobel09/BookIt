"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Airport } from "@shared/types/flightDetails";

interface SearchFlightParamsHandlerProps {
  setFromAirport: (airport: Airport | null) => void;
  setToAirport: (airport: Airport | null) => void;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setEnableReturn: (enabled: boolean) => void;
  setAdults: (adults: number) => void;
  setTravelClass: (cls: string) => void;
  setFlightSearchParams: (params: any) => void;
  setSearchTriggered: (v: boolean) => void;
  userCurrency: string;
  nonStop: boolean;
}

const SearchFlightParamsHandler = ({
  setFromAirport,
  setToAirport,
  setDepartureDate,
  setReturnDate,
  setEnableReturn,
  setAdults,
  setTravelClass,
  setFlightSearchParams,
  setSearchTriggered,
  userCurrency,
  nonStop,
}: SearchFlightParamsHandlerProps) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const depart = searchParams.get("departure_date") || "";
    const ret = searchParams.get("return_date") || "";
    const adultsParam = Number(searchParams.get("adults") || 1);
    const cls = searchParams.get("travel_class") || "ECONOMY";

    if (from) setFromAirport({ id: from, code: from } as Airport);
    if (to) setToAirport({ id: to, code: to } as Airport);
    if (depart) setDepartureDate(depart);
    if (ret) {
      setReturnDate(ret);
      setEnableReturn(true);
    }
    if (adultsParam) setAdults(adultsParam);
    setTravelClass(cls);

    if (from && to && depart && adultsParam && cls) {
      setFlightSearchParams({
        from,
        to,
        depart,
        returnDate: ret || undefined,
        adults: adultsParam,
        cabinClass: cls,
        currency: userCurrency,
        nonStop,
      });
      setSearchTriggered(true);
    }
  }, [searchParams, userCurrency, nonStop]);
  return null;
};

export default SearchFlightParamsHandler;
