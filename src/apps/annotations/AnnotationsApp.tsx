import MethodChooserForm from "./MethodChooserForm";
import { type AnnotationsAppState, type Selection } from "./types";
import config from "./config";
import MethodInstructions from "./MethodInstructions";
import { create, useStore } from "zustand";
import { getAuthedOptions } from "../../common/auth";
import ky from "ky";
import type { GetUploadIdentifierResponse } from "../../pages/api/session/getUploadIdentifier";
import { useEffect } from "react"
import { persist } from "zustand/middleware";
import ResetButton from "./ResetButton";

interface AnnotationsAppStateUsage extends AnnotationsAppState {
    setSelection: (s: Selection) => void;
    getUploadIdentifier: () => void,
    reset: () => void,
}

const getUploadIdentifier = async () => {
    const options = await getAuthedOptions();
    const res: GetUploadIdentifierResponse = await ky
        .get('/api/session/getUploadIdentifier', options)
        .json()
    return res.uploadIdentifier;
}

const annotationsAppState = create<AnnotationsAppStateUsage>()(
    persist(
        (set) => ({
            selection: {},
            setSelection: (selection) => set(state => ({ ...state, selection })),
            getUploadIdentifier: async () => {
                const identifier = await getUploadIdentifier();
                set(state => ({
                    ...state,
                    uploadIdentifier: identifier
                }))
            },
            reset: () => set({
                selection: {},
                uploadIdentifier: ""
            })
        }),
        {
            name: "annotations-app"
        }
    )
)

export default function AnnotationsApp() {
    const { selection, setSelection, uploadIdentifier, getUploadIdentifier, reset } = useStore(annotationsAppState);

    useEffect(() => {
        if(!uploadIdentifier) {
            getUploadIdentifier()
        }
    }, [uploadIdentifier])

    return <>
        <MethodChooserForm selection={selection} setSelection={(s) => setSelection(s)} config={config}/>
        <MethodInstructions selection={selection} uploadIdentifier={uploadIdentifier} />
        <ResetButton onPress={() => reset()} />
    </>
}