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
import { signIn } from "next-auth/react";

const formSchema = z.object({
    email: z.string().min(4, {
        message: "Seu email precisa de no minimo 4 caracteres.",
    }).email("Esse email nao é valido"),
    password: z.string().min(2, {
        message: "A senha tem que ter no minimo 2 caracteres",
    }),
})

export function LoginForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password
        })
    };

    return (
        <div className="bg-white dark:bg-zinc-900 min-h-screen w-2/6 flex flex-col items-center justify-center gap-2">
            <Image
                src="/logo.svg"
                alt="Vercel Logo"
                className="dark:text-white mb-10"
                width={200}
                height={50}
                priority
            />
            <h1 className="font-bold text-xl">Bem vindo ao FleetAlert</h1>
            <p className="text-zinc-600 text-center w-10/12">Lorem ipsum dolor sit amet consectetur. Vestibulum ut quis magnis diam quis id eget varius.</p>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <div className="relative w-full">
                                            <Input placeholder="******" type="password" {...field} />
                                            {form.formState.errors.password ? (
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
                    <Button type="submit" className="w-full mt-8">Entrar</Button>
                    <p className="text-zinc-600 text-center">Primeiro acesso? <a className="text-red-400 hover:text-red-500 underline" href="/account/firstAccess">Clique aqui</a></p>
                </form>
            </Form>
        </div>
    )
}
