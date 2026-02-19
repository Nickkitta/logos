import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const versionPath = join(process.cwd(), 'version.json')
    const data = await readFile(versionPath, 'utf-8')
    const versionData = JSON.parse(data)
    
    return {
      ...versionData,
      environment: process.env.VERCEL_ENV || 'development',
      deploymentUrl: process.env.VERCEL_URL || 'localhost',
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local'
    }
  } catch (error) {
    return {
      version: '1.0.0',
      buildDate: new Date().toISOString().split('T')[0],
      environment: 'development',
      error: 'Version file not found'
    }
  }
})
