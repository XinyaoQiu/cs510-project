'use client';

import { useAuth } from "@/context/AuthContext";
import { RecommendationList } from "@/components/recommendation-list";


export default function ExplorePage() {
  const { user } = useAuth();
  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-4">Interwise Explore (Recommendation) Page</h1>
      {user ? <RecommendationList /> : <p className="text-gray-600">Welcome! Login to discover personalized content.</p>}
    </main>
  );
}
