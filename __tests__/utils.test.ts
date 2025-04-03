import { getComment } from '../src/utils'
import { context } from '@actions/github'

jest.mock('@actions/github', () => ({
  context: {
    payload: {}
  }
}))

describe('getComment', () => {
  it('should return the comment body when it exists', async () => {
    context.payload.comment = { body: 'This is a test comment', id: 1 }
    const comment = await getComment()
    expect(comment).toBe('This is a test comment')
  })

  it('should return undefined when the comment body does not exist', async () => {
    context.payload.comment = undefined
    const comment = await getComment()
    expect(comment).toBeUndefined()
  })
})
