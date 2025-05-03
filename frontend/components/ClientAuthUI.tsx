'use client'

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/login-button";
import { SignUpButton } from "@/components/sign-up-button";

export function ClientAuthUI() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return user ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Hello, {user.name}</span>
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </div>
  ) : (
    <>
      <LoginButton />
      <SignUpButton />
    </>
  );
}
