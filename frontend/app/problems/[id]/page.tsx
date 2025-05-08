'use client';

import useSWR from 'swr'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"

const fetcher = (url: string) => fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    credentials: "include"
}).then(res => (res.json()))

export default function ProblemPage({
    params,
}: {
    params: { id: string }
}) {
    const { id: problemId } = params;
    const { data, error } = useSWR(`/api/v1/questions/${problemId}`, fetcher)
    const question = data?.question

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "medium":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            case "hard":
                return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }
    return <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
            <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {question.company}
                    </Badge>
                    <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50">
                        {question.category}
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                    </Badge>
                </div>
                <CardTitle className="text-xl md:text-2xl">{question.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700">{question.text}</p>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-y-2">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{question.likeCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <ThumbsDown className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{question.dislikeCount}</span>
                    </div>
                </div>
                <div className="text-sm text-gray-500">ID: {question._id}</div>
            </CardFooter>
        </Card>

        {question.answerDocs.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Answers ({question.answerDocs.length})</h2>
                <Separator className="mb-4" />

                {question.answerDocs.map((answer) => (
                    <Card key={answer._id} className="mb-4">
                        <CardContent className="pt-6">
                            <p className="text-gray-700">{answer.text}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between text-sm text-gray-500">
                            <span>ID: {answer._id}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
    </div>
}