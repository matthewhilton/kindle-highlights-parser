import MethodChooserForm from "./MethodChooserForm";
import { type AnnotationsAppState, type Selection } from "./types";
import config from "./config";
import MethodInstructions from "./MethodInstructions";
import { create, useStore } from "zustand";
import ky from "ky";
import { useEffect } from "react"
import { persist } from "zustand/middleware";
import ResetButton from "./ResetButton";
import type { GetUploadIdentifierResponse } from "../../pages/api/upload/initialise";
import UploadStatusInformation from "./UploadStatusInformation";

interface AnnotationsAppStateUsage extends AnnotationsAppState {
    setSelection: (s: Selection) => void;
    getUploadIdentifier: () => void,
    reset: () => void,
}

/**
 * The state for the entire annotations app.
 * Basically nice getters and setters wrapped together.
 */
const annotationsAppState = create<AnnotationsAppStateUsage>()(
    persist(
        (set) => ({
            selection: {},
            setSelection: (selection) => set(state => ({ ...state, selection })),
            getUploadIdentifier: async () => {
                const identifier: GetUploadIdentifierResponse = await ky
                    .get('/api/upload/initialise')
                    .json()
                set(state => ({
                    ...state,
                    uploadIdentifier: identifier.uploadIdentifier,
                    uploadAccessKey: identifier.accessKey
                }))
            },
            reset: () => set({
                selection: {},
                uploadIdentifier: undefined,
                uploadAccessKey: undefined
            })
        }),
        {
            name: "annotations-app"
        }
    )
)

/**
 * The main annotations app.
 */
export default function AnnotationsApp() {
    const { selection, setSelection, uploadIdentifier, uploadAccessKey, getUploadIdentifier, reset } = useStore(annotationsAppState);

    useEffect(() => {
        if(!uploadIdentifier) {
            getUploadIdentifier()
        }
    }, [uploadIdentifier])

    return <div className="flex flex-col gap-4">
        <MethodChooserForm selection={selection} setSelection={(s) => setSelection(s)} config={config}/>
        <MethodInstructions selection={selection} uploadIdentifier={uploadIdentifier} />
        <UploadStatusInformation uploadIdentifier={uploadIdentifier || ""} uploadAccessKey={uploadAccessKey || ""} />
        <ResetButton onPress={() => reset()} />
    </div>
}