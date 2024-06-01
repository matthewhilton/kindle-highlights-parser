import { create } from "zustand";
import { useEffect } from "react"
import {Button, type PressEvent} from 'react-aria-components';
import { humanId } from "human-id";
import { useQuery } from "react-query";
import { useSessionStatus } from "../lib/hooks";

enum ReaderType {
    Kindle = "Kindle"
}

enum UploadMethod {
    Email = "Email"
}

interface ToolState {
    sessionToken: string
    readerType?: ReaderType
    uploadMethod?: UploadMethod,
    setReaderType: (t: ReaderType) => void,
    setUploadMethod: (m: UploadMethod) => void,
}

const useToolState = create<ToolState>((set) => ({
    sessionToken: humanId({ capitalize: false, addAdverb: false }),
    readerType: undefined,
    uploadMethod: undefined,
    setReaderType: (t: ReaderType) => set((s) => ({ readerType: t })),
    setUploadMethod: (m: UploadMethod) => set((s) => ({ uploadMethod: m })),
}))

export default function ProcessTool() {
    const [readerType, uploadMethod, sessionToken] = useToolState((s) => [s.uploadMethod, s.uploadMethod, s.sessionToken]);
    const isReadyForUpload = readerType && uploadMethod

    return <div>
        <SelectReaderTypeStep />
        <SelectMethodTypeStep />

        {isReadyForUpload && <>
            <UploadInstructionsStep />
            <DataCollectStep />
        </>}
    </div>
}

const UploadInstructionsStep = () => {
    const [uploadMethod, sessionToken, readerType] = useToolState((s) => [s.uploadMethod, s.sessionToken, s.readerType]);

    if(uploadMethod == UploadMethod.Email && readerType == ReaderType.Kindle) {
        return <p> 
            Kindle EReader Upload Email instructions TODO
            email to import@neonn.dev with subject {sessionToken}
        </p>
    }

    return null;
}

const SelectReaderTypeStep = () => {
    const [selectedReaderType, setReaderType] = useToolState((s) => [s.readerType, s.setReaderType]);

    const types = [
        ReaderType.Kindle
    ]

    return <div>
        <h1> Select E-Reader </h1>
        {
            types.map(t => <ToggleButton pressed={selectedReaderType == t} key={t} text={t} onPress={() => setReaderType(t)} />)
        }
    </div>
}

const SelectMethodTypeStep = () => {
    const [methodType, setUploadMethod] = useToolState((s) => [s.uploadMethod, s.setUploadMethod]);

    const methods = [
        UploadMethod.Email
    ]

    return <div>
        <h1> Select Upload Method </h1>
        {
            methods.map(t => <ToggleButton pressed={methodType == t} key={t} text={t} onPress={() => setUploadMethod(t)} />)
        }
    </div>
}

const ToggleButton = ({ pressed, text, onPress }: { pressed: boolean, text: string, onPress?: (e: PressEvent) => void }) => (
    <div style={{backgroundColor: pressed ? "red" : "white", padding: 20}}>
        <Button onPress={onPress}> {text} </Button>
    </div>
)

const DataCollectStep = () => {
    const [sessionToken] = useToolState((s) => [s.sessionToken]);
    const { isLoading, error, data } = useSessionStatus(sessionToken);

    if (isLoading) {
        return <h1> Loading... </h1>
    }

    if (error || !data) {
        return <h1> Error! </h1>
    }

    return <h1> Is processed: {data.dataProcessed.toString()} </h1>
}