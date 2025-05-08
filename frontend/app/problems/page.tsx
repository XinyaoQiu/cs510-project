"use client"

import { useAuth } from "@/context/AuthContext";
import { ProblemList } from '@/components/problem-list';

export default function ProblemsPage() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col gap-[32px] items-center p-10">
      <h1 className="text-2xl font-bold">Problems</h1>
      {user ? <ProblemList /> : <p className="text-lg">Please login to view problems.</p>}
    </main>
  );
}
