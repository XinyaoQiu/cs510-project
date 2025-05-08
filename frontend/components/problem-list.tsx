'use client';
import useSWR from 'swr'
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const fetcher = (url: string) => fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    credentials: "include"
}).then(res => (res.json()))

export function ProblemList({ search, difficulty }: { search?: string, difficulty?: string }) {
    const router = useRouter();
    const { data, error } = useSWR(`/api/v1/questions?search=${search || ""}&difficulty=${difficulty || ""}`, fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
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
                {data.questions.map((problem) => (
                    <TableRow key={problem._id} onClick={() => router.push(`/problems/${problem._id}`)} className="cursor-pointer">
                        <TableCell>{problem.title}</TableCell>
                        <TableCell>{problem.company}</TableCell>
                        <TableCell>{problem.difficulty}</TableCell>
                        <TableCell>{problem.category}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}