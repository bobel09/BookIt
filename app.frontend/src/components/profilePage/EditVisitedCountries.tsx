import {
  Box,
  Typography,
  Chip,
  Autocomplete,
  TextField,
  Tooltip,
  Button,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useUpdateVisitedCountries } from "../../hooks/mutations/updateUserVisitedCountriesMutation";
import allCountryData from "../../data/all.json";

export const ALL_COUNTRIES_NAMES = allCountryData.map(
  (country: { name: string }) => country.name
);

export default function VisitedCountriesManager({
  userId,
  visitedCountries,
}: {
  userId: string;
  visitedCountries: string[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const { mutate: updateCountries } = useUpdateVisitedCountries(userId);

  const handleAdd = () => {
    const combined = Array.from(new Set([...visitedCountries, ...selected]));
    updateCountries(combined);
    setSelected([]);
  };

  const handleRemove = (country: string) => {
    const updated = visitedCountries.filter((c) => c !== country);
    updateCountries(updated);
  };

  return (
    <Paper
      sx={{
        width: { xs: "100%", md: 350 },
        p: 4,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={600} color="#000" sx={{ mb: 2 }}>
          Visited Countries
        </Typography>

        {visitedCountries.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {visitedCountries.map((country, idx) => (
              <Chip
                key={idx}
                label={country}
                onDelete={() => handleRemove(country)}
                sx={{
                  backgroundColor: "#e0f7fa",
                  color: "#00796b",
                  fontWeight: 500,
                  "& .MuiChip-deleteIcon": {
                    color: "#00796b",
                    "&:hover": { color: "#004d40" },
                  },
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography color="gray" sx={{ mb: 2 }}>
            No countries added yet.
          </Typography>
        )}

        <Autocomplete
          multiple
          options={ALL_COUNTRIES_NAMES}
          value={selected}
          onChange={(event, newValue) => setSelected(newValue)}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            const alreadyVisited = visitedCountries.includes(option);

            return (
              <li key={option} {...rest}>
                <Tooltip title={alreadyVisited ? "Already visited" : ""}>
                  <span>{option}</span>
                </Tooltip>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search countries to add"
              placeholder="Start typing..."
            />
          )}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={selected.length === 0}
          sx={{
            backgroundColor: "#03a9f4",
            color: "#000",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#0288d1",
              color: "#fff",
            },
          }}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
}
