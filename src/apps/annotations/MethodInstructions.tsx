import { ReaderType, UploadMethod, type Selection } from "./types";
import BoxWithHeading from "../common/BoxWithHeading";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";

interface Props { 
    selection: Selection, 
    uploadIdentifier?: string
}

/**
 * Display instructions based on the given selection, inserting the uploadIdentifier where needed.
 */
export default function MethodInstructions({ selection, uploadIdentifier }: Props) {
    const instructionsElements = getInstructions(selection, uploadIdentifier);
    return <BoxWithHeading heading = "Instructions">
        {instructionsElements}
    </BoxWithHeading>
}

const getInstructions = (selection: Selection, uploadIdentifier?: string) => {
    if (selection.method == UploadMethod.Email && selection.type == ReaderType.Kindle) {
        return (
            <Tabs>
                <TabList aria-label="Kindle email upload options" className="flex flex-row gap-3 font-medium">
                    <Tab id="physical" className="p-2 border-transparent data-[selected]:border-b-gray-900 border-b-2 mb-4 data-[selected]:font-semibold"> Physical Kindle Reader </Tab>
                    <Tab id="mobile" className="p-2 border-transparent data-[selected]:border-b-gray-900 border-b-2 mb-4 data-[selected]:font-semibold"> Kindle Mobile App </Tab>
                </TabList>
                <TabPanel id="physical">
                    <ol className="list-decimal list-inside"> 
                        <li> Open your book that has the annotations you want to extract </li>
                        <li> Tap on the center of the screen to open the top bar if it is not already shown </li> 
                        <li> Tap the notebook icon </li>
                        <li> Tap the share icon </li>
                        <li> Press yes when prompted to send the annotations to your Amazon account's email address </li>
                        <li> Forward the email you receive to <span className="font-bold"> import@neonn.dev </span> with the subject <span className="font-bold"> {uploadIdentifier} </span> </li>
                    </ol>
                </TabPanel>
                <TabPanel id="mobile">
                    <ol className="list-decimal list-inside"> 
                        <li> Open your book that has the annotations you want to extract </li>
                        <li> Tap on the center of the screen to open the top bar if it is not already shown </li>
                        <li> Tap the notebook icon </li>
                        <li> Tap the share icon </li>
                        <li> Select email </li>
                        <li> Select no citations (should be the default) and press export </li>
                        <li> Email this to <span className="font-bold"> import@neonn.dev </span> with the subject <span className="font-bold"> {uploadIdentifier} </span> </li>
                    </ol>
                    <div className="bg-blue-200 p-3 rounded-md mt-2 mb-2">
                        Note - your phone must be set to English. The Kindle mobile app translates the identifiers we use to decode the annotation file into your phones language, meaning we can't decode it unless your phone is set to English.
                    </div>
                </TabPanel>
            </Tabs>
        )
    }
}
