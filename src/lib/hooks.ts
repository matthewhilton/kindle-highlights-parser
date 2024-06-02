import useSWR from "swr"

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

export const useSessionStatus = (sessionToken: string) => useSWR<SessionStatus>(`/api/session/${sessionToken}`, fetcher, { refreshInterval(latestData) {
    // 30 seconds if already processed. Unlikely to change.
    if (latestData && latestData.dataProcessed) {
        return 30000;
    }

    // 10 seconds when not processed.
    return 10000;
}, revalidateOnFocus: true })