import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export default createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => ({
            greeting: `Hello ${input.text}`,
        })),
    getAll: publicProcedure.query(({ ctx }) => ctx.prisma.example.findMany()),
});
