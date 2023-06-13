import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import signInSchema from '@/lib/schema/signIn';
import signUpSchema from '@/lib/schema/signUp';
import userPassword from '@/lib/userPassword';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export default createTRPCRouter({
    signIn: publicProcedure
        .input(signInSchema)
        .mutation(async ({ input: { login, password }, ctx }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: login },
                        { username: login },
                    ],
                },
            });
            if (user && userPassword.compare(password, user.passwordHash, user.salt)) {
                return user;
            }
            return null;
        }),
    checkUnique: publicProcedure
        .input(z.object({ username: z.string().optional(), email: z.string().optional() }))
        .query(async ({ input: { username, email }, ctx }) => {
            if (username && (await ctx.prisma.user.findUnique({ where: { username } }))) {
                return { username: true };
            }
            if (email && (await ctx.prisma.user.findUnique({ where: { email } }))) {
                return { email: true };
            }
            return { username: false, email: false };
        }),
    signUp: publicProcedure
        .input(signUpSchema)
        .mutation(async ({ input: { username, email, password }, ctx }) => {
            const { hash: passwordHash, salt } = userPassword.encode(password);
            const userExists = await ctx.prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username },
                    ],
                },
            });
            if (userExists) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: `User ${email} or ${username} already exists`,
                });
            }
            const user = await ctx.prisma.user.create({
                data: {
                    username,
                    email,
                    passwordHash,
                    salt,
                },
            });
            return user;
        }),
});
