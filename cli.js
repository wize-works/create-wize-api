#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import prompts from 'prompts'
import { execa } from 'execa'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function replacePlaceholders(dir, replacements) {
    const files = await fs.readdir(dir)

    for (const file of files) {
        const fullPath = path.join(dir, file)
        const stats = await fs.stat(fullPath)

        if (stats.isDirectory()) {
            await replacePlaceholders(fullPath, replacements)
        } else if (stats.isFile()) {
            let content = await fs.readFile(fullPath, 'utf8')
            for (const [placeholder, value] of Object.entries(replacements)) {
                content = content.replace(new RegExp(placeholder, 'g'), value)
            }
            await fs.writeFile(fullPath, content)
        }
    }
}

async function createProject() {
    console.log(chalk.bold.cyan('\n✨ WizeWorks API Scaffolder'))

    const response = await prompts([
        {
            type: 'text',
            name: 'projectName',
            message: 'What is your project folder name?',
            initial: 'wize-api'
        },
        {
            type: 'text',
            name: 'displayName',
            message: 'What is the internal name (description)?',
            initial: 'Wize API'
        }
    ])

    const { projectName, displayName } = response
    const targetDir = path.resolve(process.cwd(), projectName)
    const templateDir = path.join(__dirname, 'templates/base')

    if (await fs.pathExists(targetDir)) {
        const { overwrite } = await prompts({
            type: 'confirm',
            name: 'overwrite',
            message: `${chalk.yellow('Warning')}: Directory already exists. Overwrite?`,
            initial: false
        })

        if (!overwrite) {
            console.log(chalk.red('✖ Operation cancelled.'))
            process.exit(1)
        }

        await fs.remove(targetDir)
    }

    console.log(`\n⏳ Creating project in ${chalk.green(targetDir)} ...`)
    await fs.copy(templateDir, targetDir)

    await replacePlaceholders(targetDir, {
        '__PROJECT_NAME__': projectName,
        '__PROJECT_DESCRIPTION__': displayName
    })

    console.log(chalk.gray('\n📦 Installing dependencies...'))
    try {
        await execa('npm', ['install'], { cwd: targetDir, stdio: 'inherit' })
    } catch (err) {
        console.error(chalk.red('\n✖ Failed to install dependencies.'))
        process.exit(1)
    }

    // ✅ Inline banner after success
    console.log(`
${chalk.bold.green('✔ WizeWorks API scaffolded successfully!')}

${chalk.cyan('Next steps:')}
1. ${chalk.yellow(`cd ${projectName}`)}
2. ${chalk.yellow('npm install')} to install dependencies
3. ${chalk.red('Add Environment Variables')} to your ${chalk.gray('.env')} file
4. ${chalk.yellow('npm run dev')} to start the local dev server

${chalk.magenta('📦 Happy building with WizeWorks!')}
${chalk.gray('Tip: Run')} ${chalk.blue('npm run patchversion')} ${chalk.gray('before each push to version your package')}
`)

    // 🟦 Offer to open in VSCode
    let hasVSCode = false
    try {
        await execa('code', ['--version'])
        hasVSCode = true
    } catch (_) {
        hasVSCode = false
    }

    if (hasVSCode) {
        const { openInVSCode } = await prompts({
            type: 'confirm',
            name: 'openInVSCode',
            message: 'Open project in VSCode?',
            initial: true
        })

        if (openInVSCode) {
            try {
                await execa('code', [targetDir], { stdio: 'inherit' })
            } catch (err) {
                console.warn(chalk.yellow('\n⚠️  Could not launch VSCode. You can open it manually with:\n'), `cd ${projectName} && code .`)
            }
        }
    } else {
        console.log(chalk.gray('\n⚠️  VSCode CLI not detected. You can open the project manually with:\n'), `cd ${projectName} && code .`)
    }
}

createProject().catch(err => {
    console.error(chalk.red('\n✖ Failed to create project:'), err)
    process.exit(1)
})
