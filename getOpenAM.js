/*
* Copyright © 2016 ForgeRock, AS.
*
* This is unsupported code made available by ForgeRock for community development
* subject to the license detailed below. The code is provided on an "as is" basis,
* without warranty of any kind, to the fullest extent permitted by law.
*
* ForgeRock does not warrant or guarantee the individual success developers may
* have in implementing the code on their development platforms or in production
* configurations.
*
* ForgeRock does not warrant, guarantee or make any representations regarding the
* use, results of use, accuracy, timeliness or completeness of any data or
* information relating to the alpha release of unsupported code. ForgeRock
* disclaims all warranties, expressed or implied, and in particular, disclaims all
* warranties of merchantability, and warranties related to the code, or any
* service or software related thereto.
*
* ForgeRock shall not be liable for any direct, indirect or consequential damages
* or costs of any type arising out of any action taken by you or others related to
* the code.
*
* The contents of this file are subject to the terms of the Common Development and
* Distribution License (the License). You may not use this file except in
* compliance with the License.
*
* You can obtain a copy of the License at https://forgerock.org/cddlv1-0/. See the
* License for the specific language governing permission and limitations under the
* License.
*
* When distributing Covered Software, include this CDDL Header Notice in each file
* and include the License file at https://forgerock.org/cddlv1-0/. If applicable,
* add the following below the CDDL Header, with the fields enclosed by brackets []
* replaced by your own identifying information: "Portions copyright [year] [name
* of copyright owner]".
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
