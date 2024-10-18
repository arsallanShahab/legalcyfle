import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { Input } from "@nextui-org/react";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

type Props = {};

const Index = (props: Props) => {
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: values.password }),
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
      toast.error("Failed to reset password");
    }
  };

  return (
    <Wrapper className="py-20">
      <FlexContainer variant="column-center">
        <h1 className="text-3xl font-bold text-green-500">LegalCyfle</h1>
        <p className="text-gray-500"></p>
      </FlexContainer>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={Yup.object({
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Required"),
        })}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form className="mx-auto max-w-md">
            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your new password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.password && errors.password}
              isInvalid={!!(touched.password && errors.password)}
              color={touched.password && errors.password ? "danger" : "default"}
            />
            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your new password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.confirmPassword && errors.confirmPassword}
              isInvalid={!!(touched.confirmPassword && errors.confirmPassword)}
              color={
                touched.confirmPassword && errors.confirmPassword
                  ? "danger"
                  : "default"
              }
            />
            <Button
              type="submit"
              className="mt-5 w-full"
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Index;
