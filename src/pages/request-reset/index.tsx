import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { Input } from "@nextui-org/react";
import { Form, Formik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const RequestReset = () => {
  const handleSubmit = async (values: { email: string }) => {
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        body: JSON.stringify(values),
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
      console.error(error);
      toast.error("Failed to send reset email");
    }
  };

  return (
    <Wrapper className="py-20">
      <h1 className="text-center text-3xl font-bold">Request Password Reset</h1>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
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
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.email && errors.email}
              isInvalid={!!(touched.email && errors.email)}
              color={touched.email && errors.email ? "danger" : "default"}
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

export default RequestReset;
