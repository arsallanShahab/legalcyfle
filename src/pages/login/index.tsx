import FlexContainer from "@/components/FlexContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { useGlobalContext } from "@/context/GlobalContext";
import LoginValidationSchema from "@/lib/schemas/login/LoginValidationSchema";
import { Input } from "@nextui-org/react";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";

type Props = {};

const Index = (props: Props) => {
  const { setUser } = useGlobalContext();

  const router = useRouter();

  const handleSubmit = async (
    values: any,
    actions: {
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) => {
    try {
      actions.setSubmitting(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        toast.success(data.message);
        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err?.message || "Something went wrong");
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleSendVefificationMail = async (email: string) => {
    if (!email) {
      toast.error("Please provide email address");
      return;
    }
    try {
      const res = await fetch("/api/auth/generate-verify-token", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Wrapper className="py-20">
      <FlexContainer variant="column-center">
        <h1 className="text-3xl font-bold text-green-500">LegalCyfle</h1>
        <p className="text-gray-500">Login to your account</p>
      </FlexContainer>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
        }) => {
          return (
            <Form className="mx-auto flex max-w-md flex-col gap-5 rounded-2xl p-3 *:w-full dark:bg-zinc-900">
              <div className="grid gap-3">
                {" "}
                <div className="grid grid-cols-2 gap-3"></div>
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  radius="sm"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  classNames={{
                    inputWrapper: "border shadow-none",
                  }}
                  isInvalid={!!errors.email && !!touched.email}
                  color={errors.email && touched.email ? "danger" : "default"}
                  errorMessage={errors.email || touched.email}
                />
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  radius="sm"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  classNames={{
                    inputWrapper: "border shadow-none",
                  }}
                  isInvalid={!!errors.password && !!touched.password}
                  color={
                    errors.password && touched.password ? "danger" : "default"
                  }
                  errorMessage={
                    errors.password && touched.password && errors.password
                  }
                />
              </div>
              <FlexContainer variant="row-end">
                <Badge onClick={() => handleSendVefificationMail(values.email)}>
                  Resend Verification Email
                </Badge>
              </FlexContainer>
              <Button
                type="submit"
                loading={isSubmitting}
                className="h-auto w-full rounded-xl bg-green-500 py-3 hover:bg-green-600"
              >
                Submit
              </Button>
              <FlexContainer variant="row-between" alignItems="center">
                <span className="text-left text-sm text-gray-500">
                  Having trouble logging in?
                </span>
                <Link href="/request-reset" className="text-sm text-green-500">
                  Reset Password
                </Link>
              </FlexContainer>
              <Link href="/signup">
                <Button className="w-full" variant={"link"}>
                  Create an Account
                </Button>
              </Link>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Index;
