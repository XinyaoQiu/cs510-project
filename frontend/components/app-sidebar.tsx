'use client'

import * as React from "react";
import { useChat } from '@ai-sdk/react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Trash2 } from "lucide-react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat();
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                LLM Assistant
                <Button variant="ghost" className="absolute right-2 top-2" onClick={() => setMessages([])}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </SidebarHeader>
            <SidebarContent className="p-2">
                {messages.map((message, index) => (
                    <div key={index} className={`p-2 rounded-md ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                        <strong>{message.role}</strong>: {message.content}
                    </div>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Input placeholder="Ask a question..." className="flex-1" value={input} onChange={handleInputChange} />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </SidebarFooter>
        </Sidebar>
    )
}
