import fs from 'fs'
import readlineSync from 'readline-sync'
import { execSync } from 'child_process'

/**
 * Use this file to build the recipes front end. Do not manually push to github
 */

/**
 *
 */
function build() {
  console.clear()
  setProdUrl()
  setVersion()
  commitChanges()
}

/**
 *
 */
function setProdUrl() {
  const filePath = './recipes-new/js/state.js'
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(/WEB_APP_URL:\s*devUrl/, 'WEB_APP_URL: prodUrl')
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('🔥 Updated WEB_APP_URL to prodUrl in js/state.js')
}

/**
 *
 */
function setVersion() {
  const indexPath = './recipes-new/index.html'
  let content = fs.readFileSync(indexPath, 'utf8')
  const match = content.match(/<span id="version-number">(.*?)<\/span>/)
  const currentVersion = match ? match[1] : null
  // Prompt user for the new version
  const newVersion = readlineSync
    .question(`Version (${currentVersion}): `)
    .trim()
  // Update the version in index.html
  content = content.replace(
    /<span id="version-number">(.*?)<\/span>/,
    `<span id="version-number">${newVersion}</span>`
  )
  // Write the file
  fs.writeFileSync(indexPath, content, 'utf8')
  console.log(`🔥 Updated version to ${newVersion} in index.html`)
}

/**
 * Prompts for a commit message and runs gacp
 */
function commitChanges() {
  const commitMessage = readlineSync.question('Commit message: ').trim()
  if (!commitMessage) {
    console.log('❌ No commit message entered. Skipping commit.')
    return
  }
  try {
    execSync('git add .', { stdio: 'inherit', shell: true })
    execSync(`git commit -m "${commitMessage}"`, {
      stdio: 'inherit',
      shell: true
    })
    execSync('git push origin main', { stdio: 'inherit', shell: true })

    console.log('✅ Changes committed successfully.')
  } catch (error) {
    console.error('❌ Error committing changes:', error.message)
  }
}

build()
