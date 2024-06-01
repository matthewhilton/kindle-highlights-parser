import { keys } from "ts-transformer-keys";
import type { AnnotationDataRow } from "./data";
import { stringify } from "csv-stringify/sync";

export function to_csv(annotations: Array<AnnotationDataRow>): string {
    const header = keys<AnnotationDataRow>();
    const data = [
        header,
        ...annotations
    ]
    return stringify(data)
}