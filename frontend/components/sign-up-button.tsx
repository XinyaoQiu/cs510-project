/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function SignUpButton() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [location, setLocation] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { fetchUser } = useAuth()

    const resetForm = () => {
        setName("")
        setLastName("")
        setLocation("")
        setEmail("")
        setPassword("")
        setConfirm("")
    }

    const handleSignUp = async () => {
        if (password !== confirm) {
            alert("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, name, lastName, location }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Register failed")
            alert("Register successful!")
            await fetchUser()
            setOpen(false)
            resetForm()
            router.push("/explore")
        } catch (err: any) {
            alert(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                <div className="grid gap-4 py-4">
                    <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                    <Input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                    <Input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                    <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <Input placeholder="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button onClick={handleSignUp} disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}