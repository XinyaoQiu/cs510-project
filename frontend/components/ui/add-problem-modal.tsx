"use client";
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

export default function AddProblemModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "",
    text: "",
    category: "",
    difficulty: "",
    company: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔐 发送 cookie 中的 JWT
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to submit question:", errorData);
        alert(`Failed: ${errorData.message || res.statusText}`);
        return;
      }

      const data = await res.json();
      console.log("Question created:", data);
      alert("Question created successfully!");
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
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
