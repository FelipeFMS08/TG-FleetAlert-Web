"use client";
import { LoginForm } from "@/components/account/login-component";
import { ModeToggle } from "@/components/shared/toggle";

export default function Login() {

   
    return (
        <main className="bg-[url('/account-background.png')] min-w-screen min-h-screen bg-no-repeat bg-cover bg-center ">
            <LoginForm />
            <div className="absolute bottom-3 right-3">
                <ModeToggle />
            </div>
        </main>
    )
}