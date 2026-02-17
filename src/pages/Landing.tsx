import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Login, WakeBackend } from "@/api/auth";
import { Card } from "@/components/ui/card";
import LandingGreeting from "@/components/landing/LandingGreeting";
import { useAuth } from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";

function Landing() {
  const [value, setValue] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const mutation = useMutation({
    mutationFn: Login,
    onSuccess: () => {
      navigate("home");
    },
    onError: () => {
      setValid(true);
      setTimeout(() => {
        setValue(""); // ← Reset OTP on error
        setValid(false);
      }, 2000);
    },
  });

  useEffect(() => {
    if (value.length === 6) {
      mutation.mutate(value);
    }
  }, [value]);
  useEffect(() => {
    WakeBackend();
  }, []);

  useEffect(() => {
    // Safely read the `access_token` cookie and decode it if present
    const getCookie = (name: string) =>
      document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(name + "="))
        ?.split("=")[1];

    const token = getCookie("access_token");
    if (!token) return;

    try {
      const decode = jwtDecode<{ userId: string }>(token);
      if (decode?.userId && decode.userId === String(user)) {
        navigate("home");
      } else {
        console.log("Invalid Token");
      }
    } catch (err) {
      console.log("Failed to decode token:", err);
    }
  }, [user]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4 md:max-w-[1920px]">
      <Card className="w-full max-w-md items-center gap-2 p-4">
        <LandingGreeting />
        <InputOTP
          maxLength={6}
          value={value}
          pattern={REGEXP_ONLY_DIGITS}
          onChange={(value) => {
            setValue(value);
          }}
          disabled={mutation.isPending || valid}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid={valid} />
            <InputOTPSlot index={1} aria-invalid={valid} />
            <InputOTPSlot index={2} aria-invalid={valid} />
            <InputOTPSlot index={3} aria-invalid={valid} />
            <InputOTPSlot index={4} aria-invalid={valid} />
            <InputOTPSlot index={5} aria-invalid={valid} />
          </InputOTPGroup>
        </InputOTP>
      </Card>
    </main>
  );
}

export default Landing;
