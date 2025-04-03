export type Env = {
  GITHUB_WORKSPACE: string
}

export const getEnv = async (): Promise<Env> => {
  return {
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE || ''
  }
}
