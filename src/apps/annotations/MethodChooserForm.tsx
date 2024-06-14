import BoxWithHeading from "../common/BoxWithHeading";
import IconButton from "../common/IconButton";
import type { AnnotationsAppConfig, Selection } from "./types";
import type { Entries } from 'type-fest'

interface Props {
    selection: Selection,
    setSelection: (selection: Selection) => void,
    config: AnnotationsAppConfig
}

/**
 * User uses this form to tell what device they are using and how they are uploading it.
 */
export default function MethodChooserForm({ selection, setSelection, config }: Props) {
    const typeOptions = (Object.entries(config.readerOptions) as Entries<typeof config.readerOptions>).map(([type, options]) => (
        <IconButton key={type} pressed={selection?.type == type} onPress={() => setSelection({...selection, type: type})} text={options.name} iconSrc={options.iconSrc} />
    ))

    const uploadOptions = (Object.entries(config.uploadOptions) as Entries<typeof config.uploadOptions>).map(([method, options]) => (
        <IconButton key={method} pressed={selection?.method == method} onPress={() => setSelection({...selection, method: method})} text={options.name} iconSrc={options.iconSrc} />
    ))

    return(
        <>
            <BoxWithHeading heading = "Select type">
                {typeOptions}
            </BoxWithHeading>
            <BoxWithHeading heading = "Select upload method">
                {uploadOptions}
            </BoxWithHeading>
        </>
    );
}