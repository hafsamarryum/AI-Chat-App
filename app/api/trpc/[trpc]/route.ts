import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/trpc/root"

const handler = (req: Request) => {
  console.log("[v0] tRPC request:", req.method, req.url)

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    onError: ({ path, error }) => {
      console.error("[v0] tRPC error at path:", path, error.message)
    },
  }).catch((error) => {
    console.error("[v0] tRPC handler error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  })
}

export { handler as GET, handler as POST }
