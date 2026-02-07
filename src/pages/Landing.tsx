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
import { Card } from "@/components/ui/card";

function Landing() {
  const [value, setValue] = useState<string>("");
  const [formatted, setFormatted] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false)
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: Login,
    onSuccess: () => {
      navigate("home")
    },
    onError: () => {
      setValid(true)
      setTimeout(() => {
        setValue(""); // ← Reset OTP on error
        setValid(false)
      }, 2000);

    },
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      setFormatted(now.toLocaleString('en-US', options));
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    if (value.length === 6) {
      mutation.mutate(value);
    }
    WakeBackend()
    
  }, [value]);



  return (
    <main className="flex flex-col gap-4 items-center justify-center min-h-screen max-w-[1920px] ">
    <Card className="items-center p-4 gap-2">
      <h1 className=" text-3xl font-bold">Good Morning</h1>
      <h2 className=" text-lg font-light">{formatted}</h2>
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
          <InputOTPSlot index={1} aria-invalid={valid}/>
          <InputOTPSlot index={2} aria-invalid={valid}/>
          <InputOTPSlot index={3} aria-invalid={valid}/>
          <InputOTPSlot index={4} aria-invalid={valid}/>
          <InputOTPSlot index={5} aria-invalid={valid}/>
        </InputOTPGroup>
      </InputOTP>
    </Card >
    </main>
    
  );
}

export default Landing;
