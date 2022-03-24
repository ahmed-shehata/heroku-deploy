import { getInput, info, setFailed } from "@actions/core";
import { exec } from "child_process";

import { herokuActionSetup } from "./lib/scripts";
import herokuLogin from "./lib/login";

const herokuAction = herokuActionSetup(getInput('app_name'));

herokuLogin()
  .then(async () => {
    exec(herokuAction('push'), { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) throw new Error(`stderr: ${stderr}`);

      info(`stdout: ${stdout}`);
    });
    info('Your Docker image was built and pushed to Heroku Container Registry.');
  })
  .then(async () => {
    await exec(herokuAction('release'), { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) throw new Error(`stderr: ${stderr}`);

      info(`stdout: ${stdout}`);
    });
    info('Your Appliction was deployed successfully.')
  })
  .catch(error => {
    setFailed(`Something went wrong building your image. [Error]: ${(error as Error).message}`);
  })
