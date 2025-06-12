"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Destination {
  dest_id: string;
  label?: string;
  name?: string;
}

interface SearchStaysParamsHandlerProps {
  setSelectedDestination: (dest: Destination | null) => void;
  setCheckinDate: (date: string) => void;
  setCheckoutDate: (date: string) => void;
  setAdults: (adults: number) => void;
  setRoomQty: (qty: number) => void;
  setSearchTriggered: (v: boolean) => void;
}

const SearchStaysParamsHandler = ({
  setSelectedDestination,
  setCheckinDate,
  setCheckoutDate,
  setAdults,
  setRoomQty,
  setSearchTriggered,
}: SearchStaysParamsHandlerProps) => {
  const params = useSearchParams();
  useEffect(() => {
    const dest_id = params.get("dest_id");
    const checkin_date = params.get("checkin_date");
    const checkout_date = params.get("checkout_date");
    const adultsParam = params.get("adults");
    const room_qty = params.get("room_qty");
    if (dest_id) setSelectedDestination({ dest_id });
    if (checkin_date) setCheckinDate(checkin_date);
    if (checkout_date) setCheckoutDate(checkout_date);
    if (adultsParam) setAdults(Number(adultsParam));
    if (room_qty) setRoomQty(Number(room_qty));
    if (dest_id && checkin_date && checkout_date && adultsParam && room_qty) {
      setSearchTriggered(true);
    }
  }, [params]);
  return null;
};

export default SearchStaysParamsHandler;
