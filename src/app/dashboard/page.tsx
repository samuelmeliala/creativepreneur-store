
"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { mapFirebaseProduct, Product } from "../../lib/data";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const productsRef = ref(db, "/");
		const unsubscribe = onValue(productsRef, (snapshot) => {
			const data = snapshot.val() as Record<string, any> | any[] | null;
			if (data) {
				const arrayData: any[] = Array.isArray(data)
					? (data.filter(Boolean) as any[])
					: (Object.entries(data).map(([id, v]) => mapFirebaseProduct(id, v)));
				// If already mapped, skip mapping again
				setProducts(
					arrayData.length && typeof arrayData[0].id === "string"
						? (arrayData as Product[])
						: (arrayData.map((v, i) => mapFirebaseProduct(String(i), v)))
				);
			} else {
				setProducts([]);
			}
		});
		return () => unsubscribe();
	}, []);

	// Aggregate by tanggal_diserahkan
	const dateCounts: Record<string, number> = {};
	products.forEach((p) => {
		const date = p.tanggal_diserahkan || "(none)";
		dateCounts[date] = (dateCounts[date] || 0) + 1;
	});
	// Format dates for x-axis labels (e.g., YYYY-MM-DD or locale string)
	const sortedDates = Object.keys(dateCounts)
		.filter((d) => d && d !== "(none)")
		.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Newest first
	const formattedLabels = sortedDates.map((d) => {
		const dateObj = new Date(d);
		if (isNaN(dateObj.getTime())) return d;
		// Format: day month year (e.g., 17 November 2025)
		return dateObj.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		});
	});
	const chartData = {
		labels: formattedLabels,
		datasets: [
			{
				label: "Number of Submissions",
				data: sortedDates.map((d) => dateCounts[d]),
				backgroundColor: "#1950d2ff",
			},
		],
	};


	// Group products by year from tanggal_diserahkan
	const productsByYear: Record<string, Product[]> = {};
	products.forEach((p) => {
		const date = p.tanggal_diserahkan;
		if (!date) return;
		const year = new Date(date).getFullYear();
		if (!isNaN(year)) {
			const yearStr = String(year);
			if (!productsByYear[yearStr]) productsByYear[yearStr] = [];
			productsByYear[yearStr].push(p);
		}
	});
	const availableYears = Object.keys(productsByYear).sort();

	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold text-[#112D4E] mb-4">Dashboard</h1>
			<div className="bg-white rounded shadow p-4 w-full h-[480px] md:h-[600px] flex flex-col mb-8">
				<h2 className="text-lg font-bold mb-2 text-[#112D4E]">Per Tanggal Diserahkan</h2>
				<div className="flex-1 w-full">
					<Bar
						data={chartData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: { display: false },
								title: { display: false },
							},
							scales: {
								x: { title: { display: true, text: "Tanggal Diserahkan" } },
								y: { title: { display: true, text: "Number of People" }, beginAtZero: true },
							},
						}}
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
				{availableYears.map((year) => {
					// Aggregate NIM prefixes for this year
					const nimPrefixCounts: Record<string, number> = {};
					productsByYear[year].forEach((p) => {
						const prefix = (p.nim || '').slice(0, 2);
						if (prefix) nimPrefixCounts[prefix] = (nimPrefixCounts[prefix] || 0) + 1;
					});
					const sortedPrefixes = Object.keys(nimPrefixCounts).sort();
					const nimChartData = {
						labels: sortedPrefixes.map((prefix) => `B${prefix}`),
						datasets: [
							{
								label: `Number of People (${year})`,
								data: sortedPrefixes.map((prefix) => nimPrefixCounts[prefix]),
								backgroundColor: "#2693f9ff",
							},
						],
					};
					return (
						<div key={year} className="bg-white rounded shadow p-4 w-full h-[260px] flex flex-col">
							<h2 className="text-base font-bold mb-2 text-[#112D4E]">NIM Mahasiswa ({year})</h2>
							<div className="flex-1 w-full">
								<Bar
									data={nimChartData}
									options={{
										responsive: true,
										maintainAspectRatio: false,
										plugins: {
											legend: { display: false },
											title: { display: false },
										},
										scales: {
											x: { title: { display: true, text: `NIM Mahasiswa (BXX) - ${year}` } },
											y: { title: { display: true, text: "Number of People" }, beginAtZero: true },
										},
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

