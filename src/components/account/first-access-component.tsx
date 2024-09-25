import Image from "next/image";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

const formSchema = z.object({
    email: z.string().min(4, {
        message: "Seu email precisa de no minimo 4 caracteres.",
    }).email("Esse email nao é valido")
})

export function FirstAccessForm() {

    const [sendingEmail, setSendingEmail] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setSendingEmail(true);
        signIn('credentials', {
            redirect: false,
            email: values.email
        });
    };

    return (
        <>
            {sendingEmail ? (
                <div className="bg-white dark:bg-zinc-900 w-1/2 h-96 rounded-md mx-auto justify-self-center flex flex-col items-center justify-center gap-4" >
                    <Image
                        src="/logo.png"
                        alt="Vercel Logo"
                        className="dark:text-white mb-3"
                        width={200}
                        height={50}
                        priority
                    />
                    <p className="dark:text-zinc-300 text-center w-1/2 mb-5">Uma senha temporária está sendo enviada a você, verifique seu email e faça o login.</p>
                    <a
                        className="w-1/2 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        href="/account/login"
                    >
                        Voltar ao login
                    </a>
                </div>
            ) :
                (
                    <div className="bg-white dark:bg-zinc-900 min-h-screen w-2/6 flex flex-col items-center justify-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Vercel Logo"
                            className="dark:text-white mb-10"
                            width={200}
                            height={50}
                            priority
                        />
                        <h1 className="font-bold text-xl">Bem vindo ao FleetAlert</h1>
                        <p className="text-zinc-600 text-center w-10/12">Como é seu primeiro acesso, você precisa digitar seu email e uma senha temporária sera enviado para você.</p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-10/12 mt-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <div className="relative w-full">
                                                        <Input placeholder="email@email.com" {...field} />
                                                        {form.formState.errors.email ? (
                                                            <CircleX className="text-primary absolute right-2 top-3" />
                                                        ) : field.value ? (
                                                            <CircleCheck className="text-green-500 absolute right-2 top-3" />
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full mt-8">Enviar Senha</Button>
                                <p className="text-zinc-600 text-center">Não é o primeiro acesso? <a className="text-red-400 hover:text-red-500 underline" href="/account/login">Clique aqui</a></p>
                            </form>
                        </Form>
                    </div>

                )
            };
        </>
    )
}
