const OpenAI = require("openai");
const fetch = require("node-fetch");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = "booking-com15.p.rapidapi.com";
const RAPIDAPI_BASE = `https://${RAPID_API_HOST}`;

exports.generateItinerary = async (req, res) => {
  try {
    const {
      city,  
      dateFrom,
      dateTo,
      adults,
      fromAirport,
      toAirport,
      extraPreferences,
      includeFlights,
      includeStays,
      preferences,
    } = req.body;

    const missingFields = [];
    if (!dateFrom) missingFields.push("dateFrom");
    if (!dateTo) missingFields.push("dateTo");
    if (!adults) missingFields.push("adults");
    if (!preferences) missingFields.push("preferences");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Step 1: Build prompt
    let prompt = `Creează un itinerariu de călătorie personalizat pentru ${adults} adult${adults > 1 ? "i" : ""}, în perioada ${dateFrom} - ${dateTo}, în orașul ${city}.

Profilul utilizatorului:
- Climat preferat: ${preferences.climate || "nedefinit"}
- Stil de călătorie: ${preferences.tripStyle || "nedefinit"}
- Interese: ${preferences.interests?.join(", ") || "nedefinit"}
- Buget: ${preferences.budget || "nedefinit"}
- Tip hotel: ${preferences.hotelType || "nedefinit"}
- Preferințe culinare: ${preferences.foodPreference || "nedefinit"}
${fromAirport && toAirport ? `- Zbor dorit: ${fromAirport} → ${toAirport}` : "- Nu s-a specificat un zbor."}
- Preferințe suplimentare: ${extraPreferences?.trim() || "niciuna"}

IMPORTANT: Din lista de zboruri de mai jos, alege cel mai potrivit zbor pentru preferințele utilizatorului și returnează DOAR indexul său (flightIndex). La fel pentru cazare (stayIndex) din lista de hoteluri. Nu rescrie structura zborului sau hotelului, doar indexul!

Te rog să creezi un itinerariu detaliat, structurat pe zile, cu activități diverse, recomandări de restaurante pentru mese, sugestii de relaxare și explorare, adaptate la preferințele de mai sus. Pentru fiecare zi (cu excepția zilelor de sosire și plecare), include în jur de 4-5 activități principale (vizite, experiențe, plimbări, etc.) plus recomandări de masă (mic dejun, prânz, cină). Zilele de sosire și plecare pot avea mai puține activități, adaptate la context. Pentru fiecare zi, grupează activitățile pe momente ale zilei (dimineață, prânz, după-amiază, seară). Fiecare activitate să aibă:
- momentul zilei (ex: dimineață, prânz, seară)
- tipul (activitate, masă, relaxare, etc.)
- descriere scurtă
- locație (dacă este relevant)

Returnează răspunsul strict în formatul JSON de mai jos, fără explicații suplimentare:
{
  "flightIndex": <index sau null>,
  "stayIndex": <index sau null>,
  "itinerary": [
    {
      "day": 1,
      "title": "Titlu sugestiv pentru zi (ex: Sosire și explorare centrală)",
      "activities": [
        { "time": "dimineață", "type": "activitate", "description": "Vizită la muzeul de artă", "location": "Muzeul de Artă" },
        { "time": "prânz", "type": "masă", "description": "Prânz la Bistro Central", "location": "Bistro Central" },
        { "time": "după-amiază", "type": "activitate", "description": "Plimbare în parc", "location": "Parcul Central" },
        { "time": "seară", "type": "masă", "description": "Cină la Restaurantul Panoramic", "location": "Restaurant Panoramic" }
      ]
    },
    ...
  ]
}
IMPORTANT: Nu returna alte câmpuri decât cele din structura de mai sus! Dacă nu există zbor sau cazare, pune valoarea null pentru acele câmpuri.`;
    let flights = null;
    let stays = null;

    // Step 2: Get flight offers
    if (includeFlights && fromAirport && toAirport) {
      const queryParams = new URLSearchParams({
        from: fromAirport,
        to: toAirport,
        depart: dateFrom,
        returnDate: dateTo,
        adults: String(adults),
        cabinClass: "ECONOMY",
        currency: preferences.currency || "USD",
      });

      const flightsRes = await fetch(`https://bookit-x4d1.onrender.com/api/flights/offers?${queryParams}`, {
        method: "GET",
      });
      flights = await flightsRes.json();
      const flightsOffers = flights.flightOffers?.slice(0, 3).map((flightOffer) => {
  const firstSegment = flightOffer.segments?.[0];
  const returnSegment = flightOffer.segments?.[1];

  const getLegInfo = (segment) => {
    const leg = segment?.legs?.[0];
    const carrier = leg?.carriersData?.[0];

    return leg
      ? {
          airline: carrier?.name || null,
          airlineLogo: carrier?.logo || null,
          flight_number: leg.flightInfo?.flightNumber?.toString() || leg.flightNumber?.toString() || null,
          departure: leg.departureTime || null,
          arrival: leg.arrivalTime || null,
        }
      : null;
  };

  const priceObj = flightOffer.priceBreakdown?.total;
  const price = priceObj?.units && priceObj?.currencyCode
    ? `${priceObj.units}${priceObj.nanos ? "." + Math.floor(priceObj.nanos / 10000000) : ""} ${priceObj.currencyCode}`
    : null;

  return {
    token: flightOffer.token,
    price,
    departureSegment: {
      from: firstSegment?.departureAirport?.code || null,
      to: firstSegment?.arrivalAirport?.code || null,
      departureTime: firstSegment?.departureTime || null,
      arrivalTime: firstSegment?.arrivalTime || null,
      totalTime: firstSegment?.totalTime || null,
      legInfo: getLegInfo(firstSegment),
    },
    returnSegment: returnSegment
      ? {
          from: returnSegment?.departureAirport?.code || null,
          to: returnSegment?.arrivalAirport?.code || null,
          departureTime: returnSegment?.departureTime || null,
          arrivalTime: returnSegment?.arrivalTime || null,
          totalTime: returnSegment?.totalTime || null,
          legInfo: getLegInfo(returnSegment),
        }
      : null,
  };
});

      if (flights?.length > 0) {
        prompt += `\n\nOpțiuni de zbor disponibile:\n${JSON.stringify(flightsOffers)}`;
      }
    }
    // Step 3: Get stays (hotels)
    if (includeStays && city && dateFrom && dateTo && adults) {
      const destQuery = new URLSearchParams({ query: city });
      const destRes = await fetch(`${RAPIDAPI_BASE}/api/v1/hotels/searchDestination?${destQuery}`, {
        headers: {
          "X-RapidAPI-Key": RAPID_API_KEY,
          "X-RapidAPI-Host": RAPID_API_HOST,
        },
      });
      const destData = await destRes.json();
      const toStays = destData.data?.[0]?.dest_id;
      if (!toStays) {
        return res.status(500).json({ error: "Could not resolve destination ID for hotels." });
      }
      const staysQueryParams = new URLSearchParams({
        dest_id: toStays,
        checkin_date: dateFrom,
        checkout_date: dateTo,
        adults: String(adults),
        room_qty: "1",
        currency: preferences.currency,
      });
      const staysRes = await fetch(`https://bookit-x4d1.onrender.com/api/stays/hotels?${staysQueryParams}`, {
        method: "GET",
      });
      const staysData = await staysRes.json();
      stays = staysData?.data?.hotels || staysData?.hotels || [];
      // Only top 3 for AI
      const staysForPrompt = stays.slice(0, 3).map((hotel) => ({
        name: hotel.property?.name || hotel.name || null,
        address: hotel.accessibilityLabel || hotel.address || null,
        price: hotel.property?.priceBreakdown?.grossPrice?.value
          ? `${hotel.property.priceBreakdown.grossPrice.value} ${hotel.property.priceBreakdown.grossPrice.currency}`
          : hotel.price || null,
        rating: hotel.property?.reviewScore || hotel.rating || null,
        photoUrl: hotel.property?.photoUrls?.[0] || hotel.photoUrl || null,
      }));
      if (staysForPrompt.length > 0) {
        prompt += `\n\nOpțiuni de cazare disponibile:\n${JSON.stringify(staysForPrompt)}`;
      }
    }
   
    // Step 4: Call OpenAI
    const aiResponse = await client.chat.completions.create({
      model: "gpt-4.1", 
      messages: [{ role: "user", content: prompt }],
    });
    const content = aiResponse.choices?.[0]?.message?.content;
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { itinerary: content };
    }

    let selectedFlight = null;
    if (parsed.flightIndex !== undefined && flights?.flightOffers?.[parsed.flightIndex]) {
      selectedFlight = flights.flightOffers[parsed.flightIndex];
    }

    let selectedStay = null;
    if (parsed.stayIndex !== undefined && stays?.[parsed.stayIndex]) {
      selectedStay = stays[parsed.stayIndex];
    }
    let stayBookingUrl = null;
if (selectedStay) {
  const detailsSelectedStay = await fetch(
    `https://bookit-x4d1.onrender.com/api/stays/hotel-details?hotel_id=${selectedStay.hotel_id}&arrival_date=${dateFrom}&departure_date=${dateTo}&adults=${adults}&currency_code=${preferences.currency || "USD"}`,
    { method: "GET" }
  );
const detailsSelectedStayData = await detailsSelectedStay.json();
console.log("detailsSelectedStayData", detailsSelectedStayData);
console.log("detailsSelectedStayData.url", detailsSelectedStayData.data.url);
stayBookingUrl = detailsSelectedStayData.data.url || null;
}

    if (parsed.stay) delete parsed.stay;

    res.status(200).json({
      ...parsed,
      selectedFlight,
      selectedStay,
      stayBookingUrl,
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ error: "An error occurred while generating the itinerary." });
  }
};

// New destination suggestion endpoint
exports.suggestDestinations = async (req, res) => {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({ error: "Missing user preferences." });
    }
    // Build a prompt for OpenAI
    const prompt = `Sugerează 5 destinații de călătorie (oraș, țară) potrivite pentru următorul profil de utilizator. Returnează doar un array JSON cu 5 stringuri, fiecare în formatul 'Oraș, Țară'. Nu adăuga explicații sau alte câmpuri, doar array-ul!\n\nProfil utilizator:\n- Climat preferat: ${preferences.climate || "nedefinit"}\n- Stil de călătorie: ${preferences.tripStyle || "nedefinit"}\n- Interese: ${preferences.interests?.join(", ") || "nedefinit"}\n- Buget: ${preferences.budget || "nedefinit"}\n- Tip hotel: ${preferences.hotelType || "nedefinit"}\n- Preferințe culinare: ${preferences.foodPreference || "nedefinit"}`;

    const aiResponse = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
    });
    const content = aiResponse.choices?.[0]?.message?.content;
    let suggestions;
    try {
      suggestions = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: "AI response could not be parsed." });
    }
    if (!Array.isArray(suggestions) || suggestions.length < 1) {
      return res.status(500).json({ error: "No suggestions returned by AI." });
    }
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error suggesting destinations:", error);
    res.status(500).json({ error: "An error occurred while suggesting destinations." });
  }
};

// Frontend rendering suggestion:
// Pentru a afișa frumos itinerariul, parcurge array-ul "itinerary" și pentru fiecare zi afișează titlul și lista de activități cu iconițe pentru tip (masă, activitate, relaxare), momentul zilei, descrierea și locația.
