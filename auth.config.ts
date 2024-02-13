import bcryptjs from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    Credentials({
        async authorize(credentials) {
            const validateFields = LoginSchema.safeParse(credentials);

            if (validateFields.success) {
                const { email, password } = validateFields.data;

                const user = await getUserByEmail(email);
                if (!user || !user.hashedPassword) {
                    return null;
                }

                const passwordsMatch = await bcryptjs.compare(
                    password,
                    user.hashedPassword,
                )

                if (passwordsMatch) {
                    return user;
                }
            }
            return null;
        }
    })
  ],
} satisfies NextAuthConfig