import React from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import type { Airport } from "../../../../shared/types/flightDetails";
import InPageLoader from "@/components/InPageLoader";

interface FlightOptionsProps {
  show: boolean;
  includeFlights: boolean;
  fromAirport: Airport | null;
  toAirport: Airport | null;
  fromSearch: any;
  toSearch: any;
  fromInput: string;
  setFromInput: (v: string) => void;
  setFromAirport: (a: Airport | null) => void;
  setToAirport: (a: Airport | null) => void;
  flightError: string;
  destinationInput: string;
}

const FlightOptions: React.FC<FlightOptionsProps> = ({
  show,
  includeFlights,
  fromAirport,
  toAirport,
  fromSearch,
  toSearch,
  fromInput,
  setFromInput,
  setFromAirport,
  setToAirport,
  flightError,
  destinationInput,
}) => {
  if (!show) return null;
  if (fromSearch.isLoading || toSearch.isLoading) {
    return <InPageLoader text="Loading airports..." />;
  }
  return (
    <Box mt={2.5}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 1, color: "#bfa600" }}
      >
        Flight Information {includeFlights ? "(Required)" : "(Optional)"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Autocomplete
          options={fromSearch.data || []}
          getOptionLabel={(option) =>
            option.name
              ? `${option.name} (${option.code})`
              : option.code || "Unknown"
          }
          onInputChange={(_, value) => setFromInput(value)}
          value={fromAirport}
          onChange={(_, value) => setFromAirport(value as Airport)}
          loading={fromSearch.isLoading}
          sx={{
            minWidth: 180,
            background: "#fff",
            borderRadius: "10px",
            flex: 1,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="From"
              placeholder="Search city or airport"
              error={!!flightError && includeFlights && !fromAirport}
              helperText={
                includeFlights && !fromAirport && flightError ? flightError : ""
              }
              sx={{ borderRadius: "10px" }}
            />
          )}
        />
        <Autocomplete
          options={toSearch.data || []}
          getOptionLabel={(option) =>
            typeof option === "object"
              ? option.name
                ? `${option.name} (${option.code})`
                : option.code || "Unknown"
              : option || "Unknown"
          }
          onInputChange={() => {}}
          value={toAirport}
          onChange={(_, value) => setToAirport(value as Airport)}
          sx={{
            minWidth: 180,
            background: "#fff",
            borderRadius: "10px",
            flex: 1,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="To"
              placeholder={`Search airports in ${destinationInput}`}
              error={!!flightError && includeFlights && !toAirport}
              helperText={
                includeFlights && !toAirport && flightError ? flightError : ""
              }
              sx={{ borderRadius: "10px" }}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default FlightOptions;
