/**
 * Types for the annotations application
 */
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

export enum CsvType {
    Kindle,
    Unknown
}

export enum AnnotationColor {
    Yellow = 'yellow',
    Orange = 'orange',
    Unknown = 'unknown'
}

export interface AnnotationDataRow {
    text: string,
    color: AnnotationColor,
    page: Number
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
    uploadAccessKey?: string
}