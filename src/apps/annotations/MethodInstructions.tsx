import { ReaderType, UploadMethod, type Selection } from "./types";
import KindleAnnotationsOpenImage from "../../images/annotations-button.png"
import KindleAnnotationsShareImage from "../../images/annotations-share.png"
import BoxWithHeading from "../common/BoxWithHeading";

export default function MethodInstructions({ selection, uploadIdentifier }: { selection: Selection, uploadIdentifier?: string }) {
    const instructionsElements = getInstructions(selection, uploadIdentifier);
    return <BoxWithHeading heading = "Instructions">
        {instructionsElements}
    </BoxWithHeading>
}

const getInstructions = (selection: Selection, uploadIdentifier?: string) => {
    if (selection.method == UploadMethod.Email && selection.type == ReaderType.Kindle) {
        return (
            <>
                <h2 className="font-medium"> Physical Kindle Reader </h2>
                <div className="flex-inline">
                    <ol className="list-decimal list-inside"> 
                        <li> Open the annotations for your book </li>
                        <img src={KindleAnnotationsOpenImage.src} alt="Open annotations button" className="h-24" /> 
                        <li> Press share </li>
                        <img src={KindleAnnotationsShareImage.src} alt="Share button" className="h-24" /> 
                        <li> Press yes when prompted to send the annotations to your Amazon account's email address </li>
                        <li> Forward the email you receive to <span className="font-bold"> import@neonn.dev </span> with the subject <span className="font-bold"> {uploadIdentifier} </span> </li>
                    </ol>
                </div>
            </>
        )
    }
}
