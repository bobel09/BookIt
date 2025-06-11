"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../../lib/axios";
import { AxiosError } from "axios";
import { useEffect } from "react";
export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const [error, setError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState<boolean | null>(
    null
  );
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await api.post("/users", { username, email, password });
      console.log("User created:", res.data);
      router.push("/login");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (password.length > 0) {
      setIsPasswordValid(password.length >= 8);
    } else {
      setIsPasswordValid(null);
    }

    if (confirmPassword.length > 0) {
      setDoPasswordsMatch(password === confirmPassword);
    } else {
      setDoPasswordsMatch(null);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 0) {
      setIsEmailValid(emailRegex.test(email));
    } else {
      setIsEmailValid(null);
    }
  }, [password, confirmPassword, email]);

  const checkUsernameAvailability = async () => {
    setCheckingUsername(true);
    setUsernameAvailable(null);
    try {
      const res = await api.get(`/users/check-username?username=${username}`);
      setUsernameAvailable(res.data.available);
    } catch {
      setUsernameAvailable(false);
    } finally {
      setCheckingUsername(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1b1b1b] text-white">
      <div className="w-full max-w-md bg-[#252525] flex flex-col items-center justify-center px-10 py-12 shadow-md">
        <Image
          src="/paper_airplane.svg"
          alt="Logo"
          className="w-20 h-20 mb-4 dark:invert"
          width={80}
          height={80}
        />
        <Typography variant="h5" className="font-bold mb-2">
          Register
        </Typography>
        <Typography className="text-gray-400 mb-6">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Log in
          </a>
        </Typography>

        <form
          onSubmit={handleSubmit}
          className="w-full space-y-3"
          autoComplete="off"
        >
          <Box className="flex gap-2">
            <TextField
              label="Username"
              fullWidth
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameAvailable(null);
              }}
              autoComplete="new-username"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor:
                      usernameAvailable === null
                        ? "#888"
                        : usernameAvailable
                        ? "#4caf50"
                        : "#f44336",
                  },
                },
              }}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#bbb" } }}
            />

            <Button
              onClick={checkUsernameAvailability}
              disabled={checkingUsername || !username}
              variant="outlined"
              sx={{
                color: "#ffcc00",
                borderColor: "#ffcc00",
                whiteSpace: "nowrap",
              }}
            >
              {checkingUsername ? "Checking..." : "Check"}
            </Button>
          </Box>
          {usernameAvailable !== null && (
            <Typography
              variant="body2"
              className={`mt-1 ${
                usernameAvailable ? "text-green-400" : "text-red-500"
              }`}
              sx={{ fontWeight: "bold" }}
            >
              {usernameAvailable
                ? "Username is available"
                : "Username is taken"}
            </Typography>
          )}

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-email"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor:
                    isEmailValid === null
                      ? "#888"
                      : isEmailValid
                      ? "#4caf50" // green
                      : "#f44336", // red
                },
              },
            }}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor:
                    isPasswordValid === null
                      ? "#888"
                      : isPasswordValid
                      ? "#4caf50"
                      : "#f44336",
                },
              },
            }}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor:
                    doPasswordsMatch === null
                      ? "#888"
                      : doPasswordsMatch
                      ? "#4caf50"
                      : "#f44336",
                },
              },
            }}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />

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
            Register
          </Button>

          {error && (
            <Typography
              variant="body2"
              className="text-red-500 mt-2 text-center"
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
          src="/nyc4.jpeg"
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
            Start Your Journey with Us!
          </Typography>
          <Typography className="mb-4 text-gray-300">
            Create an account and plan your perfect trips.
          </Typography>
        </Box>
      </div>
    </div>
  );
}
