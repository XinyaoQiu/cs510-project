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

export function SignUpButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Sign up</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sign Up</DialogTitle>
                    <DialogDescription>
                        Create an account to get started.
                    </DialogDescription>
                </DialogHeader>
                {/* Add your sign-up form here */}
                <DialogFooter>
                    <Button type="submit">Sign Up</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}