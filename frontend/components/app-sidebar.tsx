import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                LLM Assistant
            </SidebarHeader>
            <SidebarContent>

            </SidebarContent>
            <SidebarFooter>
                <form className="flex items-center gap-2">
                    <Input placeholder="Ask a question..." className="flex-1" />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </SidebarFooter>
        </Sidebar>
    )
}
