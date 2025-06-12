import { Suspense } from "react";
import HotelDetailsClient from "./HotelDetailsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading hotel details...</div>}>
      <HotelDetailsClient />
    </Suspense>
  );
}
