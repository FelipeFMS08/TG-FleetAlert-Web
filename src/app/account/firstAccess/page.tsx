"use client";
import { FirstAccessForm } from "@/components/account/first-access-component";
import { LoginForm } from "@/components/account/login-component";
import { ModeToggle } from "@/components/shared/toggle";

export default function Login() {

   
    return (
        <main className="bg-[url('/account-background.png')] min-w-screen min-h-screen bg-no-repeat bg-cover bg-center flex items-center">
            <FirstAccessForm />
            <div className="absolute bottom-3 right-3">
                <ModeToggle />
            </div>
        </main>
    )
}