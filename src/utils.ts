import { context } from '@actions/github'

/**
 * Retrieves the comment that triggered the GitHub Action.
 *
 * @returns The comment body as a string.
 */
export async function getComment(): Promise<string> {
  return context.payload.comment?.body
}
