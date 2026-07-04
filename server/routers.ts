import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { socialRouter } from "./routers/social";

export const appRouter = router({
  system: systemRouter,
  social: socialRouter,
  auth: router({
    register: authRouter.register,
    login: authRouter.login,
    getCurrentUser: authRouter.getCurrentUser,
    updateProfile: authRouter.updateProfile,
    changePassword: authRouter.changePassword,
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
