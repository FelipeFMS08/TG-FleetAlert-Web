import { UserInfosCommand } from "@/dto/commands/userInfos.command";
import { UserInfosResponse } from "@/dto/responses/userInfos.response";
import { UsersResponse } from "@/dto/responses/users.response";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getUserInfos(): Promise<UserInfosResponse> {
    const response = await fetch(`${API_URL}/api/user/getUserInfos`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user infos, check de api response');
    }

    return response.json();
}

export async function getAllUsers(): Promise<UsersResponse> {
    const response = await fetch(`${API_URL}/api/user/getAllUsers`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user infos, check de api response');
    }

    return response.json();
}

export async function updateUserInfos(userInfos: UserInfosCommand): Promise<UserInfosResponse> {
    const response = await fetch(`${API_URL}/api/user/updateUserInfos`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfos)
    });

    if (!response.ok) {
        throw new Error('Failed to update user infos, check de api response');
    }

    return response.json();
} 

export async function registerUser(email: string): Promise<UsersResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(email)
    });

    if (!response.ok) {
        throw new Error('Failed to update user infos, check de api response');
    }

    return response.json();
}