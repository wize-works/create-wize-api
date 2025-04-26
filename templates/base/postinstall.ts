// postinstall.js
import chalk from 'chalk';

console.log(`
    ${chalk.bold.green('✔ WizeWorks API scaffolded successfully!')}

    ${chalk.cyan('Next steps:')}
    1. ${chalk.yellow('cd')} your-project-name
    2. ${chalk.yellow('npm run dev')} to start the local dev server
    3. Edit ${chalk.gray('.env')} and connect your MongoDB & Sentry

    ${chalk.magenta('📦 Happy building with WizeWorks!')}
`);
