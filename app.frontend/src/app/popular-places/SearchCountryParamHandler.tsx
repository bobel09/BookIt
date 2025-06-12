"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchCountryParamHandlerProps {
  setCountry: (country: string) => void;
  defaultCountry?: string;
}

const SearchCountryParamHandler = ({
  setCountry,
  defaultCountry = "France",
}: SearchCountryParamHandlerProps) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const countryParam = searchParams.get("country") || defaultCountry;
    setCountry(countryParam);
  }, [searchParams, setCountry, defaultCountry]);
  return null;
};

export default SearchCountryParamHandler;
