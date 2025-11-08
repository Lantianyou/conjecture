import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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

interface MarketPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function MarketPage({ params }: MarketPageProps) {
	const { id } = await params;
	const market = await api.polymarket.getMarketById({ id });

	if (!market) {
		notFound();
	}

	// Parse outcome prices
	const outcomePrices = market.outcomePrices
		? JSON.parse(market.outcomePrices)
		: ["0", "0"];
	const yesPrice = outcomePrices[0] || "0";
	const noPrice = outcomePrices[1] || "0";

	// Parse outcomes
	const outcomes = market.outcomes
		? JSON.parse(market.outcomes)
		: ["Yes", "No"];

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<Link href="/">
						<Button
							variant="outline"
							size="lg"
							className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white absolute top-4 left-4"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Markets
						</Button>
					</Link>

					<div className="w-full max-w-4xl">
						<Card className="bg-white/10 border-white/20 text-white">
							<CardHeader>
								<div className="flex items-start justify-between gap-2 mb-4">
									<Badge
										variant={market.active ? "default" : "secondary"}
										className={
											market.active ? "bg-green-500 hover:bg-green-600" : ""
										}
									>
										{market.active ? "Active" : "Closed"}
									</Badge>
									{market.category && (
										<Badge
											variant="outline"
											className="border-white/20 text-white/80"
										>
											{market.category}
										</Badge>
									)}
								</div>
								<CardTitle className="text-3xl font-bold leading-tight">
									{market.question}
								</CardTitle>
								{market.description && (
									<CardDescription className="text-white/70 text-lg mt-4">
										{market.description}
									</CardDescription>
								)}
							</CardHeader>
							<CardContent className="space-y-8">
								{/* Price Information */}
								<div className="space-y-4">
									<h3 className="text-2xl font-semibold">Current Prices</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-white/5 rounded-lg p-6 border border-white/10">
											<div className="text-sm text-white/70 mb-2">
												{outcomes[0] || "Yes"} Price
											</div>
											<div className="text-4xl font-bold text-green-400">
												${parseFloat(yesPrice).toFixed(3)}
											</div>
										</div>
										<div className="bg-white/5 rounded-lg p-6 border border-white/10">
											<div className="text-sm text-white/70 mb-2">
												{outcomes[1] || "No"} Price
											</div>
											<div className="text-4xl font-bold text-red-400">
												${parseFloat(noPrice).toFixed(3)}
											</div>
										</div>
									</div>
								</div>

								{/* Market Statistics */}
								<div className="space-y-4">
									<h3 className="text-2xl font-semibold">Market Statistics</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-white/5 rounded-lg p-4 border border-white/10">
											<div className="text-sm text-white/70">Volume</div>
											<div className="text-2xl font-semibold">
												${(market.volumeNum / 1_000_000).toFixed(2)}M
											</div>
										</div>
										{market.liquidityNum !== undefined && (
											<div className="bg-white/5 rounded-lg p-4 border border-white/10">
												<div className="text-sm text-white/70">Liquidity</div>
												<div className="text-2xl font-semibold">
													${(market.liquidityNum / 1_000_000).toFixed(2)}M
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Market Details */}
								<div className="space-y-4">
									<h3 className="text-2xl font-semibold">Market Details</h3>
									<div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-3">
										{market.endDate && (
											<div className="flex justify-between items-center">
												<span className="text-white/70">End Date</span>
												<span className="font-semibold">
													{new Date(market.endDate).toLocaleString()}
												</span>
											</div>
										)}
										{market.endDateIso && (
											<div className="flex justify-between items-center">
												<span className="text-white/70">End Date (ISO)</span>
												<span className="font-semibold">
													{new Date(market.endDateIso).toLocaleString()}
												</span>
											</div>
										)}
										{market.createdAt && (
											<div className="flex justify-between items-center">
												<span className="text-white/70">Created</span>
												<span className="font-semibold">
													{new Date(market.createdAt).toLocaleString()}
												</span>
											</div>
										)}
										<div className="flex justify-between items-center">
											<span className="text-white/70">Market Type</span>
											<span className="font-semibold capitalize">
												{market.marketType || "Standard"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-white/70">Market ID</span>
											<span className="font-mono text-sm">{market.id}</span>
										</div>
									</div>
								</div>

								{/* Additional Information */}
								{market.slug && (
									<div className="space-y-4">
										<h3 className="text-2xl font-semibold">
											Additional Information
										</h3>
										<div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-3">
											<div className="flex justify-between items-center">
												<span className="text-white/70">Slug</span>
												<span className="font-mono text-sm">{market.slug}</span>
											</div>
											{market.conditionId && (
												<div className="flex justify-between items-center">
													<span className="text-white/70">Condition ID</span>
													<span className="font-mono text-sm">
														{market.conditionId}
													</span>
												</div>
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</HydrateClient>
	);
}
