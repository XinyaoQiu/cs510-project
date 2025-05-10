"use client";

import useSWR, { mutate } from "swr";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddAnswerModal from "@/components/ui/add-answer-modal";
import { useEffect, useState } from "react";
import EditQuestionModal from "@/components/ui/edit-question-modal";
import EditAnswerModal from "@/components/ui/edit-answer-modal";
import router from "next/router";
import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/utils";

const fetcher = (url: string) =>
  fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, {
    credentials: "include",
  }).then((res) => res.json());

export default function ProblemPage() {
  const { id: problemId } = useParams<{ id: string }>();
  const { data, error } = useSWR(`/api/v1/questions/${problemId}`, fetcher);
  const [userId, setUserId] = useState<string | null>(null);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<any | null>(null);
  const question = data?.question;
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleQuestionDelete = async () => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/v1/questions/${problemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete.");
      alert("Deleted successfully.");
      router.push("/problems");
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const handleAnswerDelete = async (answerId: string) => {
    if (!confirm("Are you sure you want to delete this answer?")) return;
    try {
      const res = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/v1/answers/${answerId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete.");
      alert("Answer deleted.");
      mutate(`/api/v1/questions/${problemId}`);
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleAnswerSubmitSuccess = () => {
    setShowAnswerModal(false);
    mutate(`/api/v1/questions/${problemId}`); // 刷新数据
  };

  const handleAnswerEditSuccess = () => {
    setEditingAnswer(null);
    mutate(`/api/v1/questions/${problemId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 relative">
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
            >
              {question.company}
            </Badge>
            <Badge
              variant="outline"
              className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50"
            >
              {question.category}
            </Badge>
            <Badge
              variant="outline"
              className={getDifficultyColor(question.difficulty)}
            >
              {question.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl md:text-2xl">
            {question.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{question.text}</p>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-y-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {question.likeCount}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {question.dislikeCount}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">ID: {question._id}</div>
        </CardFooter>
        {userId === question.createdBy && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditQuestionModal(true)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleQuestionDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </Card>

      {question.answerDocs.length >= 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Answers ({question.answerDocs.length})
            </h2>
            <Button size="sm" onClick={() => setShowAnswerModal(true)}>
              Add Answer
            </Button>
          </div>
          <Separator className="mb-4" />

          {question.answerDocs.map((answer: any) => (
            <Card key={answer._id} className="mb-4 relative">
              <CardContent className="pt-6">
                <p className="text-gray-700">{answer.text}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500">
                <span>ID: {answer._id}</span>
              </CardFooter>
              {userId === answer.createdBy && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAnswer(answer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAnswerDelete(answer._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {showAnswerModal && (
        <AddAnswerModal
          questionId={question._id}
          onClose={handleAnswerSubmitSuccess}
        />
      )}

      {showEditQuestionModal && (
        <EditQuestionModal
          question={question}
          onClose={() => {
            setShowEditQuestionModal(false);
            mutate(`/api/v1/questions/${problemId}`);
          }}
        />
      )}

      {editingAnswer && (
        <EditAnswerModal
          answer={editingAnswer}
          onClose={handleAnswerEditSuccess}
        />
      )}
    </div>
  );
}
