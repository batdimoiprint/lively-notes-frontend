import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Login, WakeBackend } from "@/api/auth";
import { toast } from "sonner";

function Landing() {
  const [value, setValue] = useState<string>("");

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: Login,
    onSuccess: () => {
      navigate("home")
    },
    onError: () => {
      toast.error("Login Failed");
      setValue(""); // ← Reset OTP on error
    },
  });

  useEffect(() => {
    if (value.length === 6) {
      mutation.mutate(value);
    }
    WakeBackend()
  }, [value]);

  return (
    <main>
    <section className="flex flex-col gap-4 items-center justify-center min-h-screen max-w-[1920px] ">
      <InputOTP
        maxLength={6}
        value={value}
        pattern={REGEXP_ONLY_DIGITS}
        onChange={(value) => {
          setValue(value);
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </section>
    </main>
    
  );
}

export default Landing;
