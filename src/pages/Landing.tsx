import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Login, WakeBackend } from "@/api/auth";
import { Card } from "@/components/ui/card";
import LandingGreeting from "@/components/landing/LandingGreeting";
import { useAuth } from "@/hooks/useAuth";

function Landing() {
  const [valid, setValid] = useState<boolean>(false);
  const [otpKey, setOtpKey] = useState<number>(0);
  const navigate = useNavigate();
  const { data: user, isLoading } = useAuth();
  const mutation = useMutation({
    mutationFn: Login,
    onSuccess: () => {
      navigate("home");
    },
    onError: () => {
      setValid(true);
      setTimeout(() => {
        setOtpKey((k) => k + 1); // ← Remount OTP to clear input
        setValid(false);
      }, 2000);
    },
  });

  useEffect(() => {
    WakeBackend();
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("home");
    }
  }, [isLoading, user, navigate]);

  return (
    <main className="flex min-h-screen max-w-[1920px] flex-col items-center justify-center gap-4 overflow-hidden">
      <Card className="items-center gap-2 p-4">
        <LandingGreeting />
        <InputOTP
          key={otpKey}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          onComplete={(code) => {
            mutation.mutate(code);
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
