"use client";

import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  RadioGroup,
  Radio,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Preferences } from "@shared/types/user";
import { useUpdatePreferencesMutation } from "../../hooks/mutations/updateUserPreferencesMutation";

const interestOptions = [
  "Museums",
  "Nature",
  "Beaches",
  "Nightlife",
  "History",
  "Food",
];
const foodOptions = [
  "Street food",
  "Local cuisine",
  "Fine dining",
  "Vegetarian",
];

type Props = {
  userId: string;
  initialPreferences: Preferences;
  onSuccess?: () => void;
  onError?: () => void;
};

export default function EditPreferencesForm({
  userId,
  initialPreferences,
  onSuccess,
  onError,
}: Props) {
  const [currency, setCurrency] = useState("USD");
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [hotel, setHotel] = useState("");
  const [food, setFood] = useState<string[]>([]);
  const [climate, setClimate] = useState("");
  const [tripStyle, setTripStyle] = useState("");
  const updatePreferences = useUpdatePreferencesMutation(userId);

  useEffect(() => {
    if (initialPreferences) {
      setCurrency(initialPreferences.currency || "USD");
      setInterests(initialPreferences.interests || []);
      setBudget(initialPreferences.budget || "");
      setHotel(initialPreferences.hotel || "");
      setFood(initialPreferences.food || []);
      setClimate(initialPreferences.climate || "");
      setTripStyle(initialPreferences.tripStyle || "");
    }
  }, [initialPreferences]);

  const handleCheckboxChange = (
    value: string,
    state: string[],
    setState: (val: string[]) => void
  ) => {
    setState(
      state.includes(value)
        ? state.filter((item) => item !== value)
        : [...state, value]
    );
  };

  const handleSave = () => {
    const updated: Preferences = {
      currency,
      interests,
      budget,
      hotel,
      food,
      climate,
      tripStyle,
    };
    updatePreferences.mutate(updated, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: () => {
        if (onError) onError();
      },
    });
  };

  return (
    <Paper sx={{ p: 4, backgroundColor: "white", borderRadius: 2, mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Update Preferences
      </Typography>

      <FormControl fullWidth sx={{ mb: 3, marginTop: 2 }}>
        <InputLabel
          sx={{
            color: "black",
            "&.Mui-focused": { color: "#bbb" },
          }}
        >
          Currency
        </InputLabel>
        <Select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          label="Currency"
          sx={{
            color: "black",
            "& .MuiSelect-icon": { color: "#bbb" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#aaa" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffcc00",
            },
          }}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="RON">RON</MenuItem>
          <MenuItem value="GBP">GBP</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Interests
      </Typography>
      <FormGroup row sx={{ mb: 3 }}>
        {interestOptions.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                checked={interests.includes(item)}
                onChange={() =>
                  handleCheckboxChange(item, interests, setInterests)
                }
                sx={{ color: "black", "&.Mui-checked": { color: "#ffcc00" } }}
              />
            }
            label={item}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Budget
      </Typography>
      <RadioGroup
        row
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        sx={{ mb: 3 }}
      >
        {["$", "$$", "$$$"].map((label) => (
          <FormControlLabel
            key={label}
            value={label}
            control={
              <Radio
                sx={{ color: "black", "&.Mui-checked": { color: "#ffcc00" } }}
              />
            }
            label={label}
          />
        ))}
      </RadioGroup>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: "black", "&.Mui-focused": { color: "#bbb" } }}>
          Hotel Preference
        </InputLabel>
        <Select
          value={hotel}
          onChange={(e) => setHotel(e.target.value)}
          label="Hotel Preference"
          sx={{
            color: "black",
            "& .MuiSelect-icon": { color: "#bbb" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#aaa" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffcc00",
            },
          }}
        >
          {["Hostel", "Hotel", "Resort", "Airbnb"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Food Preference
      </Typography>
      <FormGroup row sx={{ mb: 3 }}>
        {foodOptions.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                checked={food.includes(item)}
                onChange={() => handleCheckboxChange(item, food, setFood)}
                sx={{ color: "black", "&.Mui-checked": { color: "#ffcc00" } }}
              />
            }
            label={item}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Climate
      </Typography>
      <RadioGroup
        row
        value={climate}
        onChange={(e) => setClimate(e.target.value)}
        sx={{ mb: 3 }}
      >
        {["Hot", "Mild", "Cold"].map((label) => (
          <FormControlLabel
            key={label}
            value={label}
            control={
              <Radio
                sx={{ color: "black", "&.Mui-checked": { color: "#ffcc00" } }}
              />
            }
            label={label}
          />
        ))}
      </RadioGroup>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Trip Style
      </Typography>
      <RadioGroup
        row
        value={tripStyle}
        onChange={(e) => setTripStyle(e.target.value)}
        sx={{ mb: 3 }}
      >
        {["Relaxed", "Balanced", "Intense"].map((label) => (
          <FormControlLabel
            key={label}
            value={label}
            control={
              <Radio
                sx={{ color: "black", "&.Mui-checked": { color: "#ffcc00" } }}
              />
            }
            label={label}
          />
        ))}
      </RadioGroup>

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#ffcc00",
          color: "#000",
          fontWeight: "bold",
          mt: 2,
          "&:hover": {
            backgroundColor: "#e6b800",
          },
        }}
        onClick={handleSave}
      >
        Save Preferences
      </Button>
    </Paper>
  );
}
