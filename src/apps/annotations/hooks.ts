import useSWR from "swr";
import type { GetUploadStatusResponse } from "../../pages/api/upload/status/[uploadidentifier]";
import ky from "ky";

/**
 * The status of an upload
 */
export const useUploadStatus = (identifier: string, key: string) => useSWR<GetUploadStatusResponse>(`/api/upload/status/${identifier}?key=${key}`, (url: string) => ky.get(url).json<GetUploadStatusResponse>())