import BoxWithHeading from "../common/BoxWithHeading";
import { useUploadStatus } from "./hooks";
import DownloadFileIcon from "../../images/ci--file-download.svg"
import LoadingIcon from "../../images/eos-icons--loading.svg"

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
        return <span className="flex flex-row gap-2"> <img src={LoadingIcon.src} /> <h1> Waiting... </h1> </span>
    }

    if (error) {
        return <h1> Error! </h1>
    }

    if (data.annotationsExist) {
        return <a href={`/api/annotations/download/${uploadIdentifier}.csv?key=${uploadAccessKey}`} download> <span className="flex flex-row gap-2"> <img src={DownloadFileIcon.src} /> Download </span> </a>
    }

    return null;
}