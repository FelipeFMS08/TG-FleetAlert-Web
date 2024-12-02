import { Button } from "@/components/ui/button"; // Ajuste o caminho conforme necessário
import { Input } from "@/components/ui/input"; // Ajuste o caminho conforme necessário
import { Label } from "@/components/ui/label"; // Ajuste o caminho conforme necessário
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { UserInfosResponse } from "@/dto/responses/userInfos.response";
import { updateUserInfos } from "@/services/settings.service";

const userInfoSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Email inválido").optional()
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, { message: "Senha atual deve ter pelo menos 6 caracteres." }),
    newPassword: z.string().min(6, { message: "Nova senha deve ter pelo menos 6 caracteres." }),
    confirmPassword: z.string().min(6, { message: "Confirmação de senha deve ter pelo menos 6 caracteres." }),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], 
});

interface UserInfosInterface {
    data: UserInfosResponse;
    setUserInfos: React.Dispatch<React.SetStateAction<any>>;
}

export function UserSettings(props: UserInfosInterface) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userInfoSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
    });

    const [profilePicture, setProfilePicture] = useState<string>(props.data?.photo || "/default-avatar.png");

    const predefinedAvatars = [
        "/avatars/avatar1.png",
        "/avatars/avatar2.png",
        "/avatars/avatar3.png", // Adicione os caminhos dos avatares aqui
    ];

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Aqui não vamos redimensionar nem manipular a imagem
            // Apenas pegaremos o caminho local após o upload, caso o backend faça a manipulação
            const imagePath = URL.createObjectURL(file); // Cria um caminho local para a imagem
            setProfilePicture(imagePath);
        }
    };

    const onSubmitUserInfo = async (data: any) => {
        console.log("Atualizando informações do usuário:", data);
        // Envia o caminho do avatar para o backend
        const response = await updateUserInfos({ name: data.name, email: data.email, photo: profilePicture });
        console.log(response);
    };

    const onSubmitPassword = (data: any) => {
        console.log("Alterando senha:", data);
    };

    return (
        <div className="w-full p-4 shadow rounded-lg">
            <h2 className="flex justify-between min-w-full max-w-screen-xl py-3 items-center p-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md mb-5">Suas Configurações</h2>

            <form onSubmit={handleSubmit(onSubmitUserInfo)} className="flex py-3 items-center flex-col p-5 gap-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md">
                <div className="flex flex-col items-center gap-3">
                    <Label htmlFor="profilePicture">Foto de Perfil</Label>
                    <div className="relative">
                        <Image
                            alt="Profile Image"
                            src={profilePicture}
                            width={128}
                            height={128}
                            className="rounded-full w-64 h-64 object-cover cursor-pointer border border-gray-300"
                            onClick={() => document.getElementById("fileInput")?.click()}
                        />
                        <Input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            {...register("profilePicture")}
                            className="hidden"
                            onChange={handleImageChange}
                            disabled
                        />
                    </div>
                    <div className="flex gap-3">
                        {predefinedAvatars.map((avatar, index) => (
                            <div key={index} onClick={() => setProfilePicture(avatar)} className="cursor-pointer">
                                <Image src={avatar} alt={`Avatar ${index + 1}`} width={48} height={48} className="rounded-full" />
                            </div>
                        ))}
                    </div>
                    {errors.profilePicture && <p className="text-red-500">{errors.root?.message}</p>}
                </div>
                <div className="flex gap-5 w-full">
                    <div className="w-full">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" className="dark:border-zinc-700" placeholder={props.data?.name} {...register("name")} />
                        {errors.name && <p className="text-red-500">{errors.root?.message}</p>}
                    </div>

                    <div className="w-full">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" className="dark:border-zinc-700" placeholder={props.data?.email} {...register("email")} type="email" />
                        {errors.email && <p className="text-red-500">{errors.root?.message}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full">Atualizar Informações</Button>
            </form>

            <hr className="my-8" />

            {/* Formulário para alteração de senha */}
            <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="flex py-3 items-center flex-col p-5 gap-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md">
                <div className="w-full">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" className="dark:border-zinc-700" {...registerPassword("currentPassword")} type="password" />
                    {passwordErrors.currentPassword && (
                        <p className="text-red-500">{passwordErrors.root?.message}</p>
                    )}
                </div>

                <div className="w-full">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" className="dark:border-zinc-700" {...registerPassword("newPassword")} type="password" />
                    {passwordErrors.newPassword && (
                        <p className="text-red-500">{passwordErrors.root?.message}</p>
                    )}
                </div>

                <div className="w-full">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" className="dark:border-zinc-700" {...registerPassword("confirmPassword")} type="password" />
                    {passwordErrors.confirmPassword && (
                        <p className="text-red-500">{passwordErrors.root?.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full">Alterar Senha</Button>
            </form>
        </div>
    );
}
