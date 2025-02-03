import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { sendMail } from "@/lib/send-mail";
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
  subject: z.string(),
  message: z.string(),
});

const Index = (props: Props) => {
  const handleSubmit = async (
    values: z.infer<typeof initialValues>,
    actions: {
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) => {
    try {
      actions.setSubmitting(true);
      const res = await fetch("/api/user/send-mail", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          subject: `Legalcyfle ["contact"] - ${values.subject}`,
          message: `
          From: ${values.name}
          Email: ${values.email}
          Phone Number: ${values.phone}
          
          Message: ${values.message}
          
          #This is an automated email. Please do not reply to this email.`,
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
      <Heading>Contact Us</Heading>
      <Formik
        initialValues={initialValues.parse({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Name is required"),
          email: Yup.string().email().required("Email is required"),
          phone: Yup.string().length(10, "Phone number must be 10 digits"),
          subject: Yup.string().required("Subject is required"),
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
              <div className="grid grid-cols-2 gap-3">
                <Input
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
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
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.email && errors.email}
                  isInvalid={!!(touched.email && errors.email)}
                  color={touched.email && errors.email ? "danger" : "default"}
                />
                <Input
                  name="phone"
                  label="Phone"
                  placeholder="Enter your phone number"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.phone && errors.phone}
                  isInvalid={!!(touched.phone && errors.phone)}
                  color={touched.phone && errors.phone ? "danger" : "default"}
                />
                <Input
                  name="subject"
                  label="Subject"
                  placeholder="Enter subject"
                  value={values.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.subject && errors.subject}
                  isInvalid={!!(touched.subject && errors.subject)}
                  color={
                    touched.subject && errors.subject ? "danger" : "default"
                  }
                />
                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Enter your message"
                  className="col-span-2"
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

export default Index;
