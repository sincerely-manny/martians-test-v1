import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import signInSchema from '@/lib/schema/signIn';
import userPassword from '@/lib/userPassword';

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
});
