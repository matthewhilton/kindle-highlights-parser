import BoxWithHeading from "../common/BoxWithHeading";
import { useUploadStatus } from "./hooks";

interface Props {
    uploadIdentifier: string,
    uploadAccessKey: string
}

/**
 * Shows information about the upload
 */
export default function UploadStatusInformation(props: Props) {
    return (
        <BoxWithHeading heading="Annotations">
            <UploadStatusInformationInternal {...props} />
        </BoxWithHeading>
    )
}

const UploadStatusInformationInternal = ({ uploadIdentifier, uploadAccessKey }: Props) => {
    const { isLoading, error, data } = useUploadStatus(uploadIdentifier, uploadAccessKey);

    if(isLoading || !data || (data && !data.annotationsExist)) {
        return <h1> Waiting... </h1>
    }

    if (error) {
        return <h1> Error! </h1>
    }

    if (data.annotationsExist) {
        return <a href={`/api/annotations/download/${uploadIdentifier}.csv?key=${uploadAccessKey}`} download> Download </a>
    }

    return null;
}