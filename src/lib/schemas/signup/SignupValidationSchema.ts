import * as zod from "zod";

const SignupValidationSchema = zod
  .object({
    firstName: zod
      .string()
      .min(3, { message: "First Name must be at least 3 characters" })
      .regex(/^[A-Za-z]+$/, {
        message: "First Name can only contain alphabetic characters",
      }),
    lastName: zod
      .string()
      .regex(/^[A-Za-z]*$/, {
        message: "Last Name can only contain alphabetic characters",
      })
      .optional(),
    email: zod.string().email("Invalid email address"),
    password: zod
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      ),
    confirmPassword: zod
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default SignupValidationSchema;
