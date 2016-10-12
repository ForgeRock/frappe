
/*
* The contents of this file are subject to the terms of the Common Development and
* Distribution License (the License). You may not use this file except in compliance with the
* License.
*
* You can obtain a copy of the License at legal/CDDLv1.0.txt. See the License for the
* specific language governing permission and limitations under the License.
*
* When distributing Covered Software, include this CDDL Header Notice in each file and include
* the License file at legal/CDDLv1.0.txt. If applicable, add the following below the CDDL
* Header, with the fields enclosed by brackets [] replaced by your own identifying
* information: "Portions copyright [year] [name of copyright owner]".
*
* Copyright 2016 ForgeRock AS.
*/

"use strict";
var cfenv = require("cfenv")

var config = function (myOpenAM) {
  var appEnv = cfenv.getAppEnv();
  var openamBaseUrl, appUrl, notificationRoute, notificationsEnabled, username,
      password, realm, logLevel, openamOAuth2Url, oAuth2Client, oAuth2Secret,
      cdsso, cf, getProfiles, noRedirect, appName;

  // console.log(JSON.stringify(appEnv));

  // myOpenAM should hold the name of the service created in CloudFoundry
  var openamCreds = appEnv.getServiceCreds(myOpenAM);

  if (openamCreds !== null) {
    console.log("We are running in CloudFoundry! ");
    // console.log("OpenAM Access: " + JSON.stringify(openamCreds));
    openamOAuth2Url = openamCreds.uri;
    openamBaseUrl = openamOAuth2Url.slice(0,-8);
    oAuth2Client = openamCreds.username;
    oAuth2Secret = openamCreds.password;
    username = oAuth2Client || process.env.username;
    password = oAuth2Secret || process.env.password;
    cf=true;
  } else {
    console.log("We are running locally!");
    cf = false;
    if (process.env.openamBaseUrl === undefined || 
        process.env.username === undefined ||
        process.env.password === undefined) {
        console.log('FATAL Error: missing one of the mandatory env variables: \n' +
         '   openamBaseUrl, username, password' );
        process.exit();
    }
    openamBaseUrl = process.env.openamBaseUrl;
    username = process.env.username;
    password = process.env.password;
  }

  realm = process.env.realm || '/';
  logLevel = process.env.logLevel || 'info';
  notificationRoute = process.env.notificationRoute || '/';
  notificationsEnabled = process.env.notificationsEnabled || false;
  appUrl = process.env.appUrl || appEnv.url;
  cdsso = process.env.cdsso || false;
  getProfiles = process.env.getProfilesi || true;
  noRedirect = process.env.noRedirect || false;
  appName = process.env.appName || appEnv.appName;

  // console.log("Additional environemntal variables: " + JSON.stringify(appEnv));

  var config = {
                  serverUrl: openamBaseUrl,
                  appUrl: appUrl,
                  notificationRoute: notificationRoute,
                  notificationsEnabled: notificationsEnabled,
                  username: username,
                  password: password,
                  realm: realm,
                  logLevel: logLevel,
                  port: appEnv.port,
                  bind: appEnv.bind,
                  oAuth2Client: oAuth2Client,
                  oAuth2Secret: oAuth2Secret,
                  uri: appUrl,
                  cf: cf,
                  cdsso: cdsso,
                  getProfiles: getProfiles,
                  noRedirect: noRedirect,
                  appName: appName
              };
  return config;
}

exports.config = config;
