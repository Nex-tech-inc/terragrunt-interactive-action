import { context, getOctokit } from '@actions/github'

/**
 * Retrieves the comment that triggered the GitHub Action.
 *
 * @returns The comment body as a string.
 */
export async function getComment(): Promise<string> {
  return context.payload.comment?.body
}

/**
 * Adds a reaction (eyes emoji) to the comment that triggered the GitHub Action.
 *
 * @param token - The GitHub token for authentication.
 */
export async function addEyesReaction(token: string): Promise<void> {
  const octokit = getOctokit(token)

  const commentId = context.payload.comment?.id
  if (!commentId) {
    throw new Error('No comment found in the context payload.')
  }

  await octokit.rest.reactions.createForIssueComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    comment_id: commentId,
    content: 'eyes' // The emoji reaction to add
  })
}