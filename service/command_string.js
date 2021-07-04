const exec = require('child_process').exec;

let commandString = 'npx sequelize db:migrate 20210622123955-create-category'

// Exec method to run script in command line. exec takes 'command' and callback as params
exec(commandString, (error, stdout, stderr) => {
    if (error) console.log(`error: ${error.message}`);
    if (stderr) console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
});