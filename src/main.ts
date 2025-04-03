import * as core from '@actions/core'
import { isPullRequest, pullRequestDetails, PullRequestDetails } from './prs.js'
import { getInputs } from './inputs.js'
import { getEnv } from './env.js'
import path from 'path'
import { getComment } from './utils.js'
import { checkoutPullRequest } from './checkout.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.startGroup('Inputs')
    core.info('Getting inputs...')
    const inputs = getInputs()
    core.debug(`Inputs: ${JSON.stringify(inputs, null, 2)}`)

    const env = await getEnv()
    core.debug(`Env: ${JSON.stringify(env, null, 2)}`)

    const workingDirectory = path.resolve(env.GITHUB_WORKSPACE)
    core.debug(`Working directory: ${workingDirectory}`)

    if (!isPullRequest({ inputs })) {
      throw Error('Comment is not on a pull request')
    }

    const prDetails: PullRequestDetails = await pullRequestDetails({ inputs })
    core.debug(`Pull request details: ${JSON.stringify(prDetails, null, 2)}`)

    // Checkout the pull request branch
    await checkoutPullRequest(prDetails)
    const comment = await getComment({ inputs })

    core.info(comment.body)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
