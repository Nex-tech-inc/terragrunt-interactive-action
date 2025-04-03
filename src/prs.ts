import { context, getOctokit } from '@actions/github'
import { Inputs } from './inputs.js'

interface PullRequestDetailsResponse {
  repository: {
    pullRequest: {
      headRef: {
        name: string
        target: {
          oid: string
        }
      }
    }
  }
}

export interface PullRequestDetails {
  head_ref: string
  head_sha: string
}

export async function isPullRequest({ inputs }: { inputs: Inputs }) {
  const client = getOctokit(inputs.token)

  const {
    data: { pull_request }
  } = await client.rest.issues.get({
    ...context.repo,
    issue_number: context.issue.number
  })

  return !!pull_request
}

export async function pullRequestDetails({
  inputs
}: {
  inputs: Inputs
}): Promise<PullRequestDetails> {
  const client = getOctokit(inputs.token)

  const {
    repository: {
      pullRequest: { headRef }
    }
  } = await client.graphql<PullRequestDetailsResponse>(
    `
      query pullRequestDetails($repo:String!, $owner:String!, $number:Int!) {
        repository(name: $repo, owner: $owner) {
          pullRequest(number: $number) {
            headRef {
              name
              target {
                oid
              }
            }
          }
        }
      }
    `,
    {
      ...context.repo,
      number: context.issue.number
    }
  )

  return {
    head_ref: headRef.name,
    head_sha: headRef.target.oid
  }
}
