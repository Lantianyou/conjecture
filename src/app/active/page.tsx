import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { api, HydrateClient } from "@/trpc/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ActiveMarketsPage() {
	// Fetch active markets
	const markets = await api.polymarket.getTopMarkets({ limit: 50 });

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<div className="flex items-center gap-4">
						<Link href="/">
							<Button
								variant="outline"
								size="sm"
								className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Button>
						</Link>
						<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
							Active <span className="text-[hsl(280,100%,70%)]">Markets</span>
						</h1>
					</div>
					<p className="text-xl text-white/80">Currently trading and accepting bets</p>

					<div className="w-full max-w-6xl">
						{markets.length === 0 ? (
							<Card className="bg-white/10 border-white/20 text-white">
								<CardContent className="flex items-center justify-center py-12">
									<p className="text-white/70">No active markets found</p>
								</CardContent>
							</Card>
						) : (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{markets.map((market, index) => {
									const outcomePrices = market.outcomePrices ? JSON.parse(market.outcomePrices) : ["0", "0"];
									const yesPrice = outcomePrices[0] || "0";
									const noPrice = outcomePrices[1] || "0";

									return (
										<Link href={`/markets/${market.id}`} key={market.id ?? index}>
											<Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
												<CardHeader>
													<div className="flex items-start justify-between gap-2">
														<div className="flex-1">
															<CardTitle className="text-lg line-clamp-2">
																{market.question}
															</CardTitle>
															<CardDescription className="text-white/70 mt-1">
																{market.category}
															</CardDescription>
														</div>
														<Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
													</div>
												</CardHeader>
												<CardContent className="space-y-3">
													<div className="flex justify-between items-center">
														<span className="text-sm text-white/70">Volume</span>
														<span className="font-semibold">
															${(market.volumeNum / 1_000_000).toFixed(2)}M
														</span>
													</div>

													<div className="flex justify-between items-center">
														<span className="text-sm text-white/70">Yes Price</span>
														<span className="font-semibold text-green-400">
															${parseFloat(yesPrice).toFixed(2)}
														</span>
													</div>

													<div className="flex justify-between items-center">
														<span className="text-sm text-white/70">No Price</span>
														<span className="font-semibold text-red-400">
															${parseFloat(noPrice).toFixed(2)}
														</span>
													</div>

													{market.endDate && (
														<div className="flex justify-between items-center">
															<span className="text-sm text-white/70">Ends</span>
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
						)}
					</div>
				</div>
			</main>
		</HydrateClient>
	);
}
