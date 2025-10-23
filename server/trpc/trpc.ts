import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
// import { checkSupabaseConnection } from "@/lib/db-health";

const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;


