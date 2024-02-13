"use server"
import * as z from "zod"
import { RegisterSchema } from "@/schemas/index";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (values: z.infer<typeof RegisterSchema>) => {

    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        throw new Error("Invalid Fields!")
    }

    const { email, password, name } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already in use!")
    }

    await db.user.create({
        data: {
            name,
            email,
            hashedPassword,
        }
    })

    await signIn("credentials", {
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
}
