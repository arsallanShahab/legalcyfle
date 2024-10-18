import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { Input } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const Index = () => {
  const router = useRouter();
  const { token } = router.query;
  const handleVerify = async () => {
    const t = toast.loading("Verifying email...");
    try {
      const res = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email");
    } finally {
      toast.dismiss(t);
    }
  };
  useEffect(() => {
    if (token) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Wrapper className="py-20">
      <h1 className="text-center text-3xl font-bold">Verify Email</h1>
    </Wrapper>
  );
};

export default Index;
