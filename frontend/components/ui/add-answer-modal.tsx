"use client";
import { useState } from "react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddAnswerModal({
  questionId,
  onClose,
}: {
  questionId: string;
  onClose: () => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/v1/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text, questionId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Submit error:", errData);
        alert(`Failed: ${errData.message || res.statusText}`);
        return;
      }

      alert("Answer submitted!");
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit an Answer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-sm resize-y min-h-[100px]"
            placeholder="Type your answer here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
