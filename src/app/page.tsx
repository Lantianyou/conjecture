import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const markets = await api.polymarket.getMarkets({
    limit: 50,
  });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {markets.map((market) => {
                const outcomePrices = market.outcomePrices
                  ? JSON.parse(market.outcomePrices)
                  : ["0", "0"];
                const yesPrice = outcomePrices[0] || "0";
                const noPrice = outcomePrices[1] || "0";

                return (
                  <Link href={`/markets/${market.slug}`} key={market.id}>
                    <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2 text-lg">
                              {market.question}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {market.category}
                            </CardDescription>
                          </div>
                          <Badge
                            className={
                              market.active
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                            variant={market.active ? "default" : "secondary"}
                          >
                            {market.active ? "Active" : "Closed"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Volume
                          </span>
                          <span className="font-semibold">
                            ${(market.volumeNum / 1_000_000).toFixed(2)}M
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Yes Price
                          </span>
                          <span className="font-semibold text-emerald-600">
                            ${Number.parseFloat(yesPrice).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            No Price
                          </span>
                          <span className="font-semibold text-rose-600">
                            ${Number.parseFloat(noPrice).toFixed(2)}
                          </span>
                        </div>

                        {market.endDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">
                              Ends
                            </span>
                            <span className="text-sm">
                              {new Date(market.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/resolved">
              <Button size="lg" variant="outline">
                View Resolved Markets
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
