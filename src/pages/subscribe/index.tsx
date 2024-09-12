import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { Input, Textarea } from "@nextui-org/react";
import { Form, Formik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { z } from "zod";

type Props = {};

const initialValues = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  message: z.string(),
});

const Page = (props: Props) => {
  const handleSubmit = async (
    values: z.infer<typeof initialValues>,
    actions: {
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) => {
    console.log(values);
    try {
      actions.setSubmitting(true);
      const res = await fetch("/api/user/send-mail", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          subject: `Legalcyfle ["subscribe"]`,
          message: `
          From: ${values.name}
          Email: ${values.email}
          WhatsApp Number: ${values.phone}

          Message: ${values.message}


          #This is an automated email. Please do not reply to this email.
          `,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    } finally {
      actions.setSubmitting(false);
    }
  };
  return (
    <Wrapper>
      <Heading>Subscribe</Heading>
      <Formik
        initialValues={initialValues.parse({
          name: "",
          email: "",
          phone: "",
          message: "",
        })}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Name is required"),
          email: Yup.string().email().required("Email is required"),
          phone: Yup.string().length(10, "Phone number must be 10 digits"),
          message: Yup.string().required("Message is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => {
          return (
            <Form className="max-w-3xl">
              <div className="grid grid-cols-5 gap-3">
                <Input
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                  classNames={{ base: "col-span-2 md:col-span-1" }}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.name && errors.name}
                  isInvalid={!!(touched.name && errors.name)}
                  color={touched.name && errors.name ? "danger" : "default"}
                />
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  classNames={{ base: "col-span-3 md:col-span-2" }}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.email && errors.email}
                  isInvalid={!!(touched.email && errors.email)}
                  color={touched.email && errors.email ? "danger" : "default"}
                />
                <Input
                  name="phone"
                  label="WhatsApp Number"
                  placeholder="Enter your WhatsApp number"
                  classNames={{ base: "col-span-5 md:col-span-2" }}
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.phone && errors.phone}
                  isInvalid={!!(touched.phone && errors.phone)}
                  color={touched.phone && errors.phone ? "danger" : "default"}
                />
                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Enter your message"
                  className="col-span-5"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.message && errors.message}
                  isInvalid={!!(touched.message && errors.message)}
                  color={
                    touched.message && errors.message ? "danger" : "default"
                  }
                />
              </div>
              <FlexContainer variant="row-end" className="mt-5">
                <Button
                  type="submit"
                  color="primary"
                  className="col-span-2 h-auto w-full rounded-xl bg-green-500 px-6 py-3 hover:bg-green-600"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </FlexContainer>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Page;
