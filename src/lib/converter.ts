import type { AnnotationDataRow } from "./data";
import { stringify } from "csv-stringify/sync";

export function to_csv(annotations: Array<AnnotationDataRow>): string {
    // TODO somehow get the keys directly from the type.
    const header = ['text', 'color', 'page']

    const data = [
        header,
        ...annotations.map(a => Object.values(a))
    ]
    return stringify(data)
}