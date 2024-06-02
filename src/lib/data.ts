import { parse } from 'csv-parse';
import { parse as parse_html } from 'node-html-parser'

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

enum CsvType {
    Kindle,
    Unknown
}

export function parse_utf8_buffer(data: Array<any>): string {
    const buffer = Uint8Array.from(data);
    const decoder = new TextDecoder('UTF-8');
    const text = decoder.decode(buffer);
    return text;
}

export function parse_annotations_from_html(html_text: string): AnnotationDataRow[] {
    const root = parse_html(html_text);
    const headings = root.querySelectorAll(".noteHeading");
    const data = headings.map(heading => {
        const colorEl = heading.querySelector("[class^=highlight]")

        if (!colorEl) {
            return
        }

        const color = kindle_extract_color(colorEl.innerText);
        const page = kindle_extract_page(heading.innerText);

        const content = heading.nextElementSibling

        if (!content) {
            return;
        }

        const row: AnnotationDataRow = {
            text: content.innerText.trim(),
            color,
            page
        }

        return row;
    });

    // Filter out any broken ones and return
    const res = data.filter((d): d is AnnotationDataRow => d != null);

    return res;
}

export async function parse_annotation_from_csv(csv_text: string): Promise<AnnotationDataRow[]> {
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
    // Must contain the string Page x, so must be at least 5 chars long.
    if (text.length < 5) {
        return -1;
    }

    // Find index of the word 'Page' in the text.
    const pageWordIndex = text.indexOf('Page')

    if (pageWordIndex == -1) {
        return -1;
    }

    // Split the substring after the 'Page' and split by space
    // to hopefully get the number.
    const number_part = text.substring(pageWordIndex + 4).split(' ')

    if (number_part.length == 0) {
        return -1;
    }

    const num = parseInt(number_part[1])

    return !Number.isNaN(num) ? num : -1;
}

interface AnnotationColorObject {
    [index: string]: AnnotationColor;
  }

function kindle_extract_color(text: string): AnnotationColor {
    const betweenBrackets = text.match(/Highlight \((.*)\)/)?.pop()

    // TODO rest of colours.
    const to_check: AnnotationColorObject = {
        'Yellow': AnnotationColor.Yellow,
        'Orange': AnnotationColor.Orange
    }

    const matchedColorText = Object.keys(to_check).find(test_val => {
        const matchesBrackets = (betweenBrackets && betweenBrackets.toLowerCase() == test_val.toLowerCase());
        const matchesDirect = text.toLowerCase() == test_val.toLowerCase();
        return matchesBrackets || matchesDirect;
    })

    return to_check[matchedColorText || ''] || AnnotationColor.Unknown;
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