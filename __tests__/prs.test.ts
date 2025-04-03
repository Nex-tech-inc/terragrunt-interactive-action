import { isPullRequest, pullRequestDetails } from '../src/prs'
import { Inputs } from '../src/inputs'
import { getOctokit } from '@actions/github'

jest.mock('@actions/github', () => ({
  context: {
    repo: { owner: 'test-owner', repo: 'test-repo' },
    issue: { number: 1 }
  },
  getOctokit: jest.fn(() => ({
    rest: {
      issues: {
        get: jest.fn() // Properly mock this method
      }
    },
    graphql: jest.fn()
  }))
}))

const mockGetOctokit = getOctokit

describe('prs.ts', () => {
  const inputs: Inputs = { token: 'test-token' }

  describe('isPullRequest', () => {
    it('should return true if the issue is a pull request', async () => {
      // Explicitly cast `rest.issues.get` to a Jest mock
      const mockIssuesGet = mockGetOctokit(inputs.token).rest.issues
        .get as unknown as jest.Mock
      mockIssuesGet.mockResolvedValueOnce({
        data: { pull_request: {} }
      })

      const result = await isPullRequest({ inputs })
      expect(result).toBe(true)
    })

    it('should return false if the issue is not a pull request', async () => {
      // Explicitly cast `rest.issues.get` to a Jest mock
      const mockIssuesGet = mockGetOctokit(inputs.token).rest.issues
        .get as unknown as jest.Mock
      mockIssuesGet.mockResolvedValueOnce({
        data: { pull_request: null }
      })

      const result = await isPullRequest({ inputs })
      expect(result).toBe(false)
    })
  })

  describe('pullRequestDetails', () => {
    it('should return pull request details', async () => {
      // Explicitly cast `graphql` to a Jest mock
      const mockGraphql = mockGetOctokit(inputs.token)
        .graphql as unknown as jest.Mock
      mockGraphql.mockResolvedValueOnce({
        repository: {
          pullRequest: {
            headRef: {
              name: 'test-branch',
              target: { oid: 'test-sha' }
            }
          }
        }
      })

      const result = await pullRequestDetails({ inputs })
      expect(result).toEqual({
        head_ref: 'test-branch',
        head_sha: 'test-sha'
      })
    })
  })
})
