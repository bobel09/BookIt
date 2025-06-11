"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../../lib/axios";
import { AxiosError } from "axios";
import Notification from "@/components/Notification";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/users/login", {
        email,
        password,
        rememberMe,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setError(err.response?.data?.message || "Login failed");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
    // Show notification if redirected due to expired JWT
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "1") {
        setNotification({
          open: true,
          message: "Your session expired. Please log in again.",
          severity: "info",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex bg-[#1b1b1b] text-white">
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
      <div className="w-full max-w-md bg-[#252525] flex flex-col items-center justify-center px-10 py-12 shadow-md">
        <Image
          src="/paper_airplane.svg"
          alt="Logo"
          className="w-20 h-20 mb-4 dark:invert"
          width={80}
          height={80}
        />
        <Typography variant="h5" className="font-bold mb-2">
          Log In
        </Typography>
        <Typography className="text-gray-400 mb-6">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-yellow-400 hover:underline">
            Create an account
          </a>
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="w-full"
          autoComplete="one-time-code"
        >
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />

          <div className="flex items-center justify-between mb-6">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: "#ffcc00",
                    "&.Mui-checked": { color: "#ffcc00" },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "#fff" }}>Remember me?</Typography>
              }
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#ffcc00",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e6b800" },
            }}
          >
            Log In
          </Button>
          {error && (
            <Typography
              variant="body2"
              className="text-red-500 mt-4 text-center"
              sx={{ fontWeight: "bold" }}
            >
              {error}
            </Typography>
          )}
        </form>
        <Typography className="text-center text-gray-400 mt-6 text-sm">
          © 2025 Itinerary Planner. All rights reserved.
        </Typography>
      </div>

      <div className="flex-1 relative hidden md:block">
        <Image
          src="/nyc3.jpg"
          alt="City Street"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />

        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            maxWidth: "400px",
            margin: "0 auto",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          }}
          className="z-10 mt-16"
        >
          <Typography variant="h4" className="font-bold mb-4">
            Plan Your Perfect Journey!
          </Typography>
          <Typography className="mb-4 text-gray-300">
            Use our itinerary planner to organize your trip with ease.
          </Typography>
        </Box>
      </div>
    </div>
  );
}
