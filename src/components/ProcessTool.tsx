import { create } from "zustand";
import {Button, type PressEvent} from 'react-aria-components';
import { useSessionStatus } from "../lib/hooks";
import { resetSessionToken, sessionToken } from "../lib/stores";

enum ReaderType {
    Kindle = "Kindle"
}

enum UploadMethod {
    Email = "Email"
}

interface ToolState {
    readerType?: ReaderType
    uploadMethod?: UploadMethod,
    setReaderType: (t: ReaderType) => void,
    setUploadMethod: (m: UploadMethod) => void,
    reset: () => void,
}

const useToolState = create<ToolState>((set) => ({
    readerType: undefined,
    uploadMethod: undefined,
    setReaderType: (t: ReaderType) => set((s) => ({ readerType: t })),
    setUploadMethod: (m: UploadMethod) => set((s) => ({ uploadMethod: m })),
    reset: () => {
        set({
            readerType: undefined,
            uploadMethod: undefined
        })
        resetSessionToken();
    }
}))

export default function ProcessTool() {
    const [readerType, uploadMethod] = useToolState((s) => [s.uploadMethod, s.uploadMethod]);
    const isReadyForUpload = readerType && uploadMethod

    return <div>
        <SelectReaderTypeStep />
        <SelectMethodTypeStep />

        {isReadyForUpload && <>
            <UploadInstructionsStep />
            <DataCollectStep />
        </>}
        <ResetStep />
    </div>
}

const ResetStep = () => {
    const reset = useToolState((s) => s.reset);
    return <Button onPress={() => reset()}> Reset </Button>
}

const UploadInstructionsStep = () => {
    const [uploadMethod, readerType] = useToolState((s) => [s.uploadMethod, s.readerType]);
    const token = sessionToken.get();

    if(uploadMethod == UploadMethod.Email && readerType == ReaderType.Kindle) {
        return <p> 
            Kindle EReader Upload Email instructions TODO
            email to import@neonn.dev with subject {token}
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
    const token = sessionToken.get();
    const { isLoading, error, data } = useSessionStatus(token);

    if (isLoading) {
        return <h1> Loading... </h1>
    }

    if (error || !data) {
        return <h1> Error! </h1>
    }

    return <div>
        <h1> Is processed: {data.dataProcessed.toString()} </h1>
        
        {data.dataProcessed && <a href={`/api/session/download/${token}/annotations.csv`} download> Download CSV </a>}
    </div>
}