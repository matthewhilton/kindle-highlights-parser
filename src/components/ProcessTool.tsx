import { create } from "zustand";
import {Button, type PressEvent} from 'react-aria-components';
import { useSessionStatus } from "../lib/hooks";
import { resetSessionToken, sessionToken } from "../lib/stores";
import CSVIcon from "../images/fa6-solid--file-csv.svg"
import KindleIcon from "../images/uil--amazon.svg"
import EmailIcon from "../images/eva--email-outline.svg"
import KindleAnnotationsOpenImage from "../images/annotations-button.png"
import KindleAnnotationsShareImage from "../images/annotations-share.png"

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
    setReaderType: (t: ReaderType) => set(() => ({ readerType: t })),
    setUploadMethod: (m: UploadMethod) => set(() => ({ uploadMethod: m })),
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

    return <div className="flex flex-col gap-y-4">
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
    className="bg-red-500 rounded-lg p-4"
    onPress={() => reset()}
    > Reset </Button>
}

const UploadInstructionsStep = () => {
    const [uploadMethod, readerType] = useToolState((s) => [s.uploadMethod, s.readerType]);
    const token = sessionToken.get();

    if(uploadMethod == UploadMethod.Email && readerType == ReaderType.Kindle) {
        return <div className="rounded-lg bg-neutral-100 p-4">
            <h1 className="font-semibold mb-3 text-xl"> Instructions </h1>
            <h2 className="font-medium"> Physical Kindle Reader </h2>
            <div className="flex-inline">
                <ol className="list-decimal list-inside"> 
                    <li> Open the annotations for your book </li>
                    <img src={KindleAnnotationsOpenImage.src} alt="Open annotations button" className="h-24" /> 
                    <li> Press share </li>
                    <img src={KindleAnnotationsShareImage.src} alt="Share button" className="h-24" /> 
                    <li> Press yes when prompted to send the annotations to your Amazon account's email address </li>
                    <li> Forward the email you receive to <span className="font-bold"> import@neonn.dev </span> with the subject <span className="font-bold"> {token} </span> </li>
                </ol>
            </div>
        </div>
    }

    return null;
}

const SelectReaderTypeStep = () => {
    const [selectedReaderType, setReaderType] = useToolState((s) => [s.readerType, s.setReaderType]);

    const types = [
        ReaderType.Kindle
    ]

    return <div className="rounded-lg bg-neutral-100 p-4">
        <h1 className="font-semibold mb-3 text-lg"> Select E-Reader </h1>
        {
            types.map(t => <ToggleButton pressed={selectedReaderType == t} key={t} text={t} onPress={() => setReaderType(t)} icon={getReaderTypeIcon(t)} />)
        }
    </div>
}

const getReaderTypeIcon = (type: ReaderType): React.ReactNode => {
    switch(type) {
        case ReaderType.Kindle:
            return <img src={KindleIcon.src} alt="Kindle icon" />
        default:
            return <></>
    }
}

const SelectMethodTypeStep = () => {
    const [methodType, setUploadMethod] = useToolState((s) => [s.uploadMethod, s.setUploadMethod]);

    const methods = [
        UploadMethod.Email
    ]

    return <div className="rounded-lg bg-neutral-100 p-4">
        <h1 className="font-semibold mb-3 text-lg"> Select Upload Method </h1>
        {
            methods.map(t => <ToggleButton pressed={methodType == t} key={t} text={t} onPress={() => setUploadMethod(t)} icon={getMethodIcon(t)} />)
        }
    </div>
}

const getMethodIcon = (method: UploadMethod): React.ReactNode => {
    switch(method) {
        case UploadMethod.Email:
            return <img src={EmailIcon.src} />
        default:
            return <></>
    }
}

const ToggleButton = ({ pressed, text, onPress, icon }: { pressed: boolean, text: string, onPress?: (e: PressEvent) => void, icon?: React.ReactNode }) => (
    <Button 
    className={"rounded-md p-4 flex flex-col items-center w-max max-w-24 justify-center focus:outline-none " + (!pressed ? "bg-neutral-200" : "bg-orange-300")}
    aria-pressed={pressed}
    onPress={onPress}>
        {icon}
        {text}
    </Button>
)

const DataCollectStep = () => {
    const token = sessionToken.get();
    const { error, data } = useSessionStatus(token);

    if (error) {
        return <div className="rounded-lg bg-neutral-100 p-4">
            <h1 className="font-semibold mb-3 text-lg"> Error! </h1>
        </div>
    }

    if (!data || (data && !data.dataProcessed)) {
        return <div className="rounded-lg bg-neutral-100 p-4">
            <h1 className="font-semibold mb-3 text-lg"> Waiting... </h1>
        </div>
    }

    return <div className="rounded-lg bg-neutral-100 p-4">
        <h1 className="font-semibold mb-3 text-lg"> Download </h1>
        <a href={`/api/session/download/${token}/annotations.csv`} download> <span style={{display: "flex", flexDirection: "row", alignContent: "center", columnGap: 10}}> <img src={CSVIcon.src} /> Download CSV </span> </a>
    </div>
}