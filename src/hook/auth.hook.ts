import { getMe, logout, userLogin, userRegistration } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
    return useMutation({
        mutationFn: userLogin,
    });
}

export function useRegistration() {
    return useMutation({
        mutationFn: userRegistration,
    });
}

export function useGetMe() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false,
    });
}

export function useLogout() {
    return useMutation({
        mutationFn: logout,
    });
}
