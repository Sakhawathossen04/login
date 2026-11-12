import { withAuth } from "next-auth/middleware";
export default withAuth({ pages: { signIn: "/login" } });
// Add every private route of your big website here
export const config = { matcher: ["/home/:path*"] };
