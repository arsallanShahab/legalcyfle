import * as zod from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const LoginValidationSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default toFormikValidationSchema(LoginValidationSchema);
