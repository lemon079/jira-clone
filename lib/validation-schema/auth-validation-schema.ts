import { z } from "zod";

export const logInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const SignUpFormSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});
