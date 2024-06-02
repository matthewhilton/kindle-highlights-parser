import type { APIRoute } from 'astro'
import { parse_annotation_from_csv } from '../../../lib/data'
import { store_annotations } from '../../../lib/store'

interface ForwardMailBody {
  attachments?: Array<ForwardMailAttachment>
  subject?: string,
  to?: {
    text?: string
  }
}

interface ForwardMailAttachment {
  filename?: string
  content?: ForwardMailAttachmentBuffer
}

interface ForwardMailAttachmentBuffer {
 data: Array<number>
}

export const POST: APIRoute = async ({ request }) => {
  // Extract the .csv attachment.
  const json: ForwardMailBody = await request.json();
  const attachments = json.attachments || []
  const csvattachment = attachments.find(a => a.filename && a.content && a.filename.endsWith('.csv'))
  
  // Get the identifier to link the data with.
  const identifier = json.subject;

  if (!csvattachment || !csvattachment.content || !identifier) {
    // Return 200 OK to webhook, but don't do anything.
    return new Response();
  }

  // Decode the CSV buffer.
  const buffer = Uint8Array.from(csvattachment.content.data);
  const decoder = new TextDecoder('UTF-8');
  const text = decoder.decode(buffer);
  const annotations = await parse_annotation_from_csv(text);

  // Store into kv store.
  await store_annotations(identifier, annotations);

  // Return 200 to webhook to stop it retrying.
  return new Response();
}