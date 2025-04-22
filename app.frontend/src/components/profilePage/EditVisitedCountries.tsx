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

const ALL_COUNTRIES = [
  "France",
  "Germany",
  "Italy",
  "Japan",
  "Canada",
  "USA",
  "Romania",
  "Spain",
  "Greece",
  "Brazil",
  "Australia",
];

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

  return (
    <Paper
      sx={{
        width: { xs: "100%", md: 350 },
        p: 4,
        backgroundColor: "gray",
        borderRadius: 2,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Visited Countries
        </Typography>

        {visitedCountries.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {visitedCountries.map((country, idx) => (
              <Chip
                key={idx}
                label={country}
                sx={{ backgroundColor: "#03a9f4", color: "#fff" }}
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
          options={ALL_COUNTRIES}
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
            <TextField {...params} label="Search countries to add" />
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
