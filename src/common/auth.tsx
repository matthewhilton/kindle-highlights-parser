import { create, useStore } from "zustand";
import { useEffect } from "react";
import ky, { type Options } from 'ky'
import type { AuthRouteResponse } from "../pages/api/session/auth";
import { persist } from 'zustand/middleware'

export interface AuthStore {
    sessionToken?: string,
    fetchSessionToken: () => Promise<void>,
}

export const getAuthedOptions = async (): Promise<Options> => {
    const initialState = authStore.getState()
    
    if(!initialState.sessionToken) {
        await initialState.fetchSessionToken()
    }

    const sessionToken = authStore.getState();

    return {
        headers: {
            "Authorization": sessionToken.sessionToken || ""
        }
    }
}

export const authStore = create<AuthStore>()(
    persist(
        (set) => ({
            fetchSessionToken: async () => {
                const res: AuthRouteResponse = await ky
                    .get('/api/session/auth')
                    .json()
                set({ sessionToken: res.token })
            }
        }),
        {
            name: "session",
        }
    )
)