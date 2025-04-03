import { exec } from '@actions/exec'
import * as core from '@actions/core'
import { PullRequestDetails } from './prs.js'

/**
 * Checks out the branch of a pull request using the head_ref.
 *
 * @param prDetails - The details of the pull request.
 */
export async function checkoutPullRequest(
  prDetails: PullRequestDetails
): Promise<void> {
  const { head_ref } = prDetails

  try {
    // Fetch the branch from the remote
    await exec('git', ['fetch', 'origin', head_ref])

    // Checkout the branch
    await exec('git', ['checkout', head_ref])

    core.info(`Checked out branch: ${head_ref}`)
  } catch (error) {
    core.error(`Failed to checkout branch ${head_ref}: ${error}`)
    throw error
  }
}
