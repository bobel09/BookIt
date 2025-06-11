import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import type { Airport } from "../../../../shared/types/flightDetails";

interface DestinationOption {
  dest_id?: string;
  search_type?: string;
  image_url?: string;
  region?: string;
  city_name?: string;
  hotels?: number;
  city_ufi?: string | null;
  type?: string;
  lc?: string;
  dest_type?: string;
  roundtrip?: string;
  cc1?: string;
  name?: string;
  latitude?: number;
  label?: string;
  country?: string;
  longitude?: number;
  nr_hotels?: number;
  landmark_type?: number;
  airports?: Airport[];
}

interface TripDetailsFormProps {
  destinationInput: string;
  destinationOption: DestinationOption | null;
  destinationSearch: string;
  destinationError: string;
  destinationResults: any;
  setDestinationInput: (v: string) => void;
  setDestinationOption: (v: DestinationOption | null) => void;
  setDestinationSearch: (v: string) => void;
  setToAirport: (v: Airport | null) => void;
  clearDestinationUrlParams: () => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  adults: number;
  setAdults: (v: number) => void;
}

const TripDetailsForm: React.FC<TripDetailsFormProps> = ({
  destinationInput,
  destinationOption,
  destinationSearch,
  destinationError,
  destinationResults,
  setDestinationInput,
  setDestinationOption,
  setDestinationSearch,
  setToAirport,
  clearDestinationUrlParams,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  adults,
  setAdults,
}) => (
  <>
    <Typography
      variant="h5"
      sx={{ fontWeight: 800, color: "#232526", mb: 1, letterSpacing: 0.2 }}
    >
      Trip Details
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2.5,
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Autocomplete
        freeSolo
        options={
          Array.isArray(destinationResults.data?.data)
            ? (destinationResults.data.data as DestinationOption[])
            : []
        }
        getOptionLabel={(option: DestinationOption | string) =>
          typeof option === "string"
            ? option
            : option.label || option.name || option.city_name || ""
        }
        value={destinationOption || destinationInput}
        inputValue={destinationSearch}
        onInputChange={(_, value, reason) => {
          setDestinationSearch(value);
          if (reason === "reset") setDestinationInput(value);
        }}
        onChange={(_, value) => {
          if (typeof value === "string") {
            setDestinationInput(value);
            setDestinationOption(null);
          } else if (value && (value.name || value.label)) {
            setDestinationInput(
              value.name || value.label || value.city_name || ""
            );
            setDestinationOption(value);
            if (value.airports && value.airports.length > 0) {
              setToAirport(value.airports[0]);
            }
          } else {
            setDestinationInput("");
            setDestinationOption(null);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Destination"
            required
            error={!!destinationError}
            helperText={destinationError || ""}
            sx={{
              background: "#f9f9f9",
              borderRadius: "10px",
              minWidth: 160,
              width: { xs: "100%", md: 200 },
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {destinationInput && (
                    <Button
                      size="small"
                      onClick={() => {
                        setDestinationInput("");
                        setDestinationOption(null);
                        setDestinationSearch("");
                        setToAirport(null);
                        clearDestinationUrlParams();
                      }}
                      sx={{ minWidth: 0, px: 0.5, color: "#888" }}
                    >
                      Clear
                    </Button>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <TextField
        label="Departure Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        sx={{
          background: "#f9f9f9",
          borderRadius: "10px",
          minWidth: 120,
          width: { xs: "100%", md: 160 },
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      />
      <TextField
        label="Return Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        sx={{
          background: "#f9f9f9",
          borderRadius: "10px",
          minWidth: 120,
          width: { xs: "100%", md: 160 },
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      />
      <TextField
        label="Number of Adults"
        type="number"
        inputProps={{ min: 1, max: 9 }}
        value={adults}
        onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
        sx={{
          background: "#f9f9f9",
          borderRadius: "10px",
          minWidth: 100,
          width: { xs: "100%", md: 120 },
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      />
    </Box>
  </>
);

export default TripDetailsForm;
