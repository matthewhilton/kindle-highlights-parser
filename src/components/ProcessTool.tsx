import { create } from "zustand";
import {Button, type PressEvent} from 'react-aria-components';
import { useSessionStatus } from "../lib/hooks";
import { resetSessionToken, sessionToken } from "../lib/stores";
import { Icon } from '@iconify/react';

enum ReaderType {
    Kindle = "Kindle"
}

enum UploadMethod {
    Email = "Email"
}

// TODO persist all this in the nanostore instead and persist into localstorage.
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

const stepBackgroundStyle: React.CSSProperties = {
    background: "#141414",
    borderRadius: 8,
    padding: 16,
}

const stepHeadingStyle: React.CSSProperties = {
    margin: 0,
    marginBottom: 10,
}

const codestyle: React.CSSProperties = {
    padding: 6,
    backgroundColor: "#241e2e",
    borderRadius: 4,
    fontWeight: "bold"
}

export default function ProcessTool() {
    const [readerType, uploadMethod] = useToolState((s) => [s.uploadMethod, s.uploadMethod]);
    const isReadyForUpload = readerType && uploadMethod

    return <div style={{
        display: "flex",
        flexDirection: "column",
        rowGap: 10,
    }}>
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
    return <Button 
    style={{...baseButtonStyle, backgroundColor: "#2e1118"}}
    onPress={() => reset()}
    > Reset </Button>
}

const UploadInstructionsStep = () => {
    const [uploadMethod, readerType] = useToolState((s) => [s.uploadMethod, s.readerType]);
    const token = sessionToken.get();

    if(uploadMethod == UploadMethod.Email && readerType == ReaderType.Kindle) {
        return <div style={stepBackgroundStyle}>
            <h1 style={stepHeadingStyle}> Instructions </h1>
            <p> Email import@neonn.dev with the subject: </p>
            <span style={codestyle}> {token} </span> 
        </div>
    }

    return null;
}

const SelectReaderTypeStep = () => {
    const [selectedReaderType, setReaderType] = useToolState((s) => [s.readerType, s.setReaderType]);

    const types = [
        ReaderType.Kindle
    ]

    return <div style={stepBackgroundStyle}>
        <h1 style={stepHeadingStyle}> Select E-Reader </h1>
        {
            types.map(t => <ToggleButton pressed={selectedReaderType == t} key={t} text={t} onPress={() => setReaderType(t)} icon={getReaderTypeIcon(t)} />)
        }
    </div>
}

const getReaderTypeIcon = (type: ReaderType): React.ReactNode => {
    switch(type) {
        case ReaderType.Kindle:
            return <Icon icon={"uil:amazon"} />
        default:
            return <Icon icon={"carbon:unknown"} />
    }
}

const SelectMethodTypeStep = () => {
    const [methodType, setUploadMethod] = useToolState((s) => [s.uploadMethod, s.setUploadMethod]);

    const methods = [
        UploadMethod.Email
    ]

    return <div style={stepBackgroundStyle}>
        <h1 style={stepHeadingStyle}> Select Upload Method </h1>
        {
            methods.map(t => <ToggleButton pressed={methodType == t} key={t} text={t} onPress={() => setUploadMethod(t)} icon={getMethodIcon(t)} />)
        }
    </div>
}

const getMethodIcon = (method: UploadMethod): React.ReactNode => {
    switch(method) {
        case UploadMethod.Email:
            return <Icon icon={"carbon:email"} />
        default:
            return <Icon icon={"carbon:unknown"} />
    }
}

const baseButtonStyle: React.CSSProperties = {
    borderColor: "#391691",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    padding: "1em",
    border: 4,
    rowGap: 10,
    fontSize: "1.5em",
    borderRadius: 8,
    outline: "none",
    boxShadow: "none"
}

const ToggleButton = ({ pressed, text, onPress, icon }: { pressed: boolean, text: string, onPress?: (e: PressEvent) => void, icon?: React.ReactNode }) => (
    <Button style={{
        ...baseButtonStyle,
        backgroundColor: pressed ? "#1b0e3b" : "#333333", 
        borderColor: pressed ? "#4d1dc4" : "#391691",
        borderStyle: pressed ? "solid" : "none",
    }}
    onPress={onPress}>
        {icon}
        {text}
    </Button>
)

const DataCollectStep = () => {
    const token = sessionToken.get();
    const { error, data } = useSessionStatus(token);

    if (error) {
        return <h1 style={stepHeadingStyle}> Error! </h1>
    }

    if (!data || (data && !data.dataProcessed)) {
        return <div style={{...stepBackgroundStyle, display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center", columnGap: 20}}>
            <h1 style={stepHeadingStyle}> Waiting... </h1>
            <span className="loader"></span>
        </div>
    }

    return <div style={stepBackgroundStyle}>
        <h1 style={stepHeadingStyle}> Download </h1>
        <a href={`/api/session/download/${token}/annotations.csv`} download style={{...baseButtonStyle}}> <span style={{display: "flex", flexDirection: "row", alignContent: "center", columnGap: 10}}> <Icon icon="flowbite:file-csv-outline" /> Download CSV </span> </a>
    </div>
}