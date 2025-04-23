import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function LoginButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>
                        Enter your email and password to login.
                    </DialogDescription>
                </DialogHeader>
                {/* Add your login form here */}
                <DialogFooter>
                    <Button type="submit">Login</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}