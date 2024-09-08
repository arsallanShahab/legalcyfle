import FlexContainer from "@/components/FlexContainer";
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

  const handleSubmit = async (values: any) => {
    try {
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
        {({ values, handleChange, setFieldValue, errors, touched }) => {
          return (
            <Form className="mx-auto max-w-md rounded-2xl p-3 dark:bg-zinc-900">
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
              <Button
                type="submit"
                className="mt-5 h-auto w-full rounded-xl bg-green-500 py-3 hover:bg-green-600"
              >
                Submit
              </Button>
              <p className="mt-3 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-green-500">
                  Sign up
                </Link>
              </p>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Index;
