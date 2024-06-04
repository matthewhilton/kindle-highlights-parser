export interface Selection {
    type?: ReaderType,
    method?: UploadMethod
}

export enum ReaderType {
    Kindle = "Kindle"
}

export enum UploadMethod {
    Email = "Email"
}

export interface AnnotationsAppConfig {
    readerOptions: ReaderTypeMap,
    uploadOptions: UploadTypeMap
}

export type ReaderTypeMap = { [key in ReaderType]: ReaderConfigOption}
export type UploadTypeMap = { [key in UploadMethod]: UploadConfigOption}

export interface UploadConfigOption {
    name: string,
    iconSrc: string
}

export interface ReaderConfigOption {
    name: string,
    iconSrc: string,
}

export type AnnotationsAppState = {
    selection: Selection,
    uploadIdentifier?: string
}