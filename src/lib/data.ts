import { parse } from 'csv-parse';

enum AnnotationColor {
    Yellow,
    Unknown
}

export interface AnnotationDataRow {
    text: String,
    color: AnnotationColor,
    page: Number
}

enum CsvType {
    Kindle,
    Unknown
}

export async function parse_annotation_from_csv(csv_text: String): Promise<AnnotationDataRow[]> {
    return new Promise((resolve) => {
        parse(csv_text, { relax_quotes: true }, (err, rows) => {
            if(err) {
                return resolve([]);
            }

            const type = determine_file_type(rows);
            
            switch(type) {
                case CsvType.Kindle:
                    return resolve(parse_kindle_annotations(rows));
                default:
                    return resolve([]);
            }
        })
    })
}

// TODO move to own file ?
function parse_kindle_annotations(rows: Array<any>): Array<AnnotationDataRow> {
    // Remove the first 8 rows, which is garbage.
    rows = rows.slice(8);

    // Parse each row normally.
    const parsed: Array<AnnotationDataRow> = rows.map(row => {
        return {
            text: row[3],
            color: kindle_extract_color(row[0]),
            page: kindle_extract_page(row[1])
        }
    });

    return parsed;
}

function kindle_extract_page(text: string): Number {
    text = text.replace('Page ', '');
    return parseInt(text)
}

function kindle_extract_color(text: string): AnnotationColor {
    const betweenBrackets = text.match(/Highlight \((.*)\)/)?.pop()

    if (betweenBrackets === 'Yellow') {
        return AnnotationColor.Yellow;
    }

    // TODO rest of colours.

    return AnnotationColor.Unknown;
}

function determine_file_type(rows: Array<any>): CsvType {
    if (is_kindle_file(rows)) {
        return CsvType.Kindle;
    }

    return CsvType.Unknown;
}

function is_kindle_file(rows: Array<any>): boolean {
    // Kindle files have 8 starting rows with random garbage, ensure these exist.
    if (rows.length < 8) {
        return false;
    }

    // The 7th row has the actual headers
    if (rows[7].length != 4) {
        return false;
    }

    // The first row header should be Annotation Type.
    return rows[7][0] == 'Annotation Type'
}

export function persist_loaded_data(data: StoredAnnotationData) {
    // TODO.
}