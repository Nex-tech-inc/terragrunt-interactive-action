import { context, getOctokit } from '@actions/github'
import { Inputs } from './inputs.js'

interface CommentResponse {
  body: string
  id: number
}

/**
 * Retrieves the comment that triggered the GitHub Action.
 *
 * @returns The comment body as a string.
 */
export async function getComment({
  inputs
}: {
  inputs: Inputs
}): Promise<CommentResponse> {
  const commentId = context.payload.comment?.id
  if (!commentId) {
    throw new Error('No comment found in the context payload.')
  }
  await addEyesReaction({ inputs, commentId })
  return {
    body: context.payload.comment?.body,
    id: commentId
  }
}

/**
 * Adds a reaction (eyes emoji) to the comment that triggered the GitHub Action.
 *
 * @param token - The GitHub token for authentication.
 */
export async function addEyesReaction({
  inputs,
  commentId
}: {
  inputs: Inputs
  commentId: number
}): Promise<void> {
  const octokit = getOctokit(inputs.token)

  await octokit.rest.reactions.createForIssueComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    comment_id: commentId,
    content: 'eyes' // The emoji reaction to add
  })
}
