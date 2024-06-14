import type { APIRoute } from 'astro'
import { store_annotations } from '../../../backend/annotations/data'
import { parse_annotation_from_csv, parse_annotations_from_html, parse_utf8_buffer } from '../../../backend/annotations/parsing'
import type { AnnotationDataRow } from '../../../apps/annotations/types'

interface ForwardMailBody {
  attachments?: Array<ForwardMailAttachment>
  subject?: string,
  to?: {
    text?: string
  }
}

enum AttachmentType {
  CSVFromPhysicalKindle,
  HTMLFromMobileKindle
}

interface ForwardMailAttachment {
  filename?: string
  content?: ForwardMailAttachmentBuffer,
}

interface ForwardMailAttachmentBuffer {
 data: Array<number>
}

// Handle if there is a .csv or a .html attachment.
// .CSV comes directly from the Physical kindle reader
// whereas from mobile it comes in as .html document.
const parseAttachment = (body: ForwardMailBody): { type: AttachmentType, file: ForwardMailAttachment } | undefined => {
  const attachments = body.attachments || [];
  const csvattachment = attachments.find(a => a.filename && a.content && a.filename.endsWith('.csv'))

  if (csvattachment) {
    return  {
      type: AttachmentType.CSVFromPhysicalKindle,
      file: csvattachment
    }
  }

  const htmlattachment = attachments.find(a => a.filename && a.content && a.filename.endsWith('.html'))

  if (htmlattachment) {
    return {
      type: AttachmentType.HTMLFromMobileKindle,
      file: htmlattachment
    }
  }

  return // No matches.
}

const parseData = async (type: AttachmentType, file: ForwardMailAttachment): Promise<AnnotationDataRow[]> => {
  switch(type) {
    case AttachmentType.CSVFromPhysicalKindle:
      return parse_annotation_from_csv(parse_utf8_buffer(file.content?.data || []))
    case AttachmentType.HTMLFromMobileKindle:
      return parse_annotations_from_html(parse_utf8_buffer(file.content?.data || []))
  }
}

export const POST: APIRoute = async ({ request }) => {
  const json: ForwardMailBody = await request.json();

  // Extract necessary info.
  const identifier = json.subject;
  const attachment = parseAttachment(json)
  
  // Likely garbage, just ignore.
  // Return 200 OK to webhook to stop retries, but don't do anything.
  if (!attachment || !identifier) {
    return new Response();
  }

  // Parse the file depending on the type.
  const annotations = await parseData(attachment.type, attachment.file);

  // Store into kv store.
  await store_annotations(identifier, annotations);

  // Return 200 to webhook to stop it retrying.
  return new Response();
}