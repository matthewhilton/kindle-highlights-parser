import useSWR from "swr"

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

export const useSessionStatus = (sessionToken: string) => useSWR<SessionStatus>(`/api/session/${sessionToken}`, fetcher, { refreshInterval(latestData) {
    // 20 seconds if already processed. Unlikely to change.
    if (latestData && latestData.dataProcessed) {
        return 20000;
    }

    // 3 seconds when not processed.
    return 3000;
}, revalidateOnFocus: false })