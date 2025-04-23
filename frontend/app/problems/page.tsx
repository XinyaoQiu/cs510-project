"use client"

import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const problems = [
  {
    id: 1,
    title: "Two Sum",
    company: "LeetCode",
    difficulty: "Easy",
    category: "Array",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    company: "LeetCode",
    difficulty: "Medium",
    category: "Linked List",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    company: "LeetCode",
    difficulty: "Medium",
    category: "String",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    company: "LeetCode",
    difficulty: "Hard",
    category: "Array",
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    company: "LeetCode",
    difficulty: "Medium",
    category: "String",
  },
]

export default function ProblemsPage() {
  const router = useRouter()
  return (
    <main className="flex flex-col gap-[32px] items-center">
      <h1 className="text-2xl font-bold">Problems</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow key={problem.id} onClick={() => router.push(`/problems/${problem.id}`)} className="cursor-pointer">
              <TableCell>{problem.title}</TableCell>
              <TableCell>{problem.company}</TableCell>
              <TableCell>{problem.difficulty}</TableCell>
              <TableCell>{problem.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
