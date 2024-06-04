import { stringify } from "csv-stringify/sync";
import type { AnnotationDataRow } from "../../apps/annotations/types";

export function to_csv(annotations: Array<AnnotationDataRow>): string {
    // TODO somehow get the keys directly from the type.
    const header = ['text', 'color', 'page']

    const data = [
        header,
        ...annotations.map(a => Object.values(a))
    ]
    return stringify(data)
}