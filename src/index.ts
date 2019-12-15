import * as core from "@actions/core";
import { isInputPkgIsFolder, findfiles } from "./lib/utility";
import { DeployUsingMSDeploy } from "./lib/deployusingmsdeploy";

async function run() {
  try {
    // Read inputs
    const webSiteName = core.getInput("webSiteName", {
      required: true
    });
    const webDeployPackageInput = core.getInput("package", {
      required: true
    });

    var availableWebPackages = await findfiles(webDeployPackageInput);
    if (availableWebPackages.length == 0) {
      throw new Error("Web deploy package not found");
    }

    if (availableWebPackages.length > 1) {
      throw new Error("More than one web deploy package found");
    }

    const webDeployPkg = availableWebPackages[0];
    const isFolderBasedDeployment = await isInputPkgIsFolder(webDeployPkg);

    await DeployUsingMSDeploy(
      webDeployPkg,
      webSiteName,
      null,
      false, // removeAdditionalFilesFlag,
      false, // excludeFilesFromAppDataFlag,
      false, // takeAppOfflineFlag,
      undefined, // virtualApplication,
      undefined, // setParametersFile,
      "-verbose", // additionalArguments,
      isFolderBasedDeployment,
      true
    );
  } catch (e) {
    core.setFailed((e as Error).message);
  }
}

run();
