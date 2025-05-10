'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/utils";

export default function EditQuestionModal({
  question,
  onClose,
}: {
  question: any;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: question.title,
    text: question.text,
    category: question.category,
    difficulty: question.difficulty,
    company: question.company,
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/v1/questions/${question._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed to update question");

      alert("Question updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <Input
            placeholder="Company"
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
          />
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-sm resize-y min-h-[100px]"
            placeholder="Enter question text..."
            value={form.text}
            onChange={(e) => handleChange("text", e.target.value)}
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
          <Select
            value={form.difficulty}
            onValueChange={(val) => handleChange("difficulty", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
