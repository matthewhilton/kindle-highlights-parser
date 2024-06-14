// All the config required for this app.
// E.g. what options are available, their icons, etc...
// so when you need to add extra things, you can just do it here

import { ReaderType, UploadMethod, type AnnotationsAppConfig } from "./types";
import KindleIcon from "../../images/uil--amazon.svg"
import EmailIcon from "../../images/eva--email-outline.svg"

const config: AnnotationsAppConfig = {
    readerOptions: {
        [ReaderType.Kindle]: {
            name: "Kindle",
            iconSrc: KindleIcon.src
        }
    },
    uploadOptions: {
        [UploadMethod.Email]: {
            name: "Email",
            iconSrc: EmailIcon.src
        }
    }
};

export default config;