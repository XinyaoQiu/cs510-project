"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProblemList } from "@/components/problem-list";
import AddProblemModal from "@/components/ui/add-problem-modal";

export default function ProblemsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  return (
    <main className="flex flex-col gap-[32px] items-center p-10">
      <div className="flex justify-between items-center w-full max-w-5xl">
        <h1 className="text-2xl font-bold">Problems</h1>
        <Button onClick={() => setShowModal(true)}>Add Problem</Button>
      </div>
      <div className="flex gap-2 w-full justify-center">
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Select onValueChange={setDifficulty} value={difficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {user ? (
        <ProblemList search={search} difficulty={difficulty} />
      ) : (
        <p className="text-lg">Please login to view problems.</p>
      )}
      {showModal && <AddProblemModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
