'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/utils";

export default function EditAnswerModal({
  answer,
  onClose,
}: {
  answer: any;
  onClose: () => void;
}) {
  const [text, setText] = useState(answer.text);

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/v1/answers/${answer._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            text,
            questionId: answer.questionId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update answer");

      alert("Answer updated!");
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
          <DialogTitle>Edit Answer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-sm resize-y min-h-[100px]"
            placeholder="Edit your answer..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
