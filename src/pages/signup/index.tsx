import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import SignupValidationSchema from "@/lib/schemas/signup/SignupValidationSchema";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Form, Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";

type Props = {};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

const Index = (props: Props) => {
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    action: FormikHelpers<FormValues>,
  ) => {
    try {
      action.setSubmitting(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        action.resetForm();
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      if (err.message.includes("exist")) {
        action.setErrors({ email: err.message || "Email already exists" });
      }
      toast.error(err.message || "An error occurred. Please try again later");
    } finally {
      action.setSubmitting(false);
    }
  };

  return (
    <Wrapper className="py-20">
      <FlexContainer variant="column-center">
        {" "}
        <h3 className="text-center text-4xl font-semibold text-green-500">
          LegalCyfle
        </h3>
        <h3 className="text-center text-xl font-semibold text-black dark:text-zinc-200">
          Sign up for an account
        </h3>
      </FlexContainer>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={toFormikValidationSchema(SignupValidationSchema)}
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
            <Form className="mx-auto max-w-md rounded-2xl p-3 dark:bg-zinc-900">
              <div className="grid gap-3">
                {" "}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="firstName"
                    label="First Name"
                    radius="sm"
                    onChange={(e) => setFieldValue("firstName", e.target.value)}
                    placeholder="Enter Your First Name"
                    classNames={{
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.firstName}
                    isInvalid={!!errors.firstName && !!touched.firstName}
                    color={errors.firstName ? "danger" : "default"}
                    errorMessage={
                      errors.firstName && touched.firstName && errors.firstName
                    }
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    radius="sm"
                    value={values.lastName}
                    onChange={handleChange}
                    placeholder="Enter Your Last Name"
                    classNames={{
                      inputWrapper: "border shadow-none",
                    }}
                  />
                </div>
                <Select
                  name="gender"
                  placeholder="Select gender"
                  labelPlacement="outside"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-900",
                    trigger: "border shadow-none",
                  }}
                  items={[
                    {
                      name: "Male",
                      value: "male",
                    },
                    {
                      name: "Female",
                      value: "female",
                    },
                  ]}
                  onChange={(e) => {
                    setFieldValue("gender", e.target.value);
                  }}
                  selectedKeys={values?.gender ? [values.gender] : ""}
                >
                  {(gender) => (
                    <SelectItem key={gender?.value} value={gender?.value}>
                      {gender?.name}
                    </SelectItem>
                  )}
                </Select>
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
                  isInvalid={!!errors.email || !!touched.email}
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
                {values.password && (
                  <Input
                    name="confirmPassword"
                    label="Confirm Password"
                    radius="sm"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Your Password"
                    classNames={{
                      inputWrapper: "border shadow-none",
                    }}
                    isInvalid={
                      !!errors.confirmPassword && !!touched.confirmPassword
                    }
                    color={
                      errors.confirmPassword && touched.confirmPassword
                        ? "danger"
                        : "default"
                    }
                    errorMessage={
                      errors.confirmPassword &&
                      touched.confirmPassword &&
                      errors.confirmPassword
                    }
                  />
                )}
              </div>
              <Button
                type="submit"
                loading={isSubmitting}
                className="mt-5 h-auto w-full rounded-xl bg-green-500 py-3"
              >
                Submit
              </Button>
              <p className="mt-3 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-green-500">
                  Log in
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
