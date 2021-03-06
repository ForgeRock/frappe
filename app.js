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

// This application is based on Zoltan Tarcsay's node-agent-demo

var express = require('express');
var app = express();
var openamAgent = require('openam-agent');

// If using CloudFoundry and using the OpenAM Service Broker "myopenam" is the
// name of the service created with the Service Broker
var config = require('./getOpenAM').config('myopenam');

// console.log("DUMPED Config: " + JSON.stringify(config));
var agent = new openamAgent.PolicyAgent(config);

config.sessionCache = new openamAgent.SimpleCache({
                expiresAfterSeconds: 60
});
var cookieShield = new openamAgent.CookieShield({
                          getProfiles: config.getProfiles,
                          cdsso: config.cdsso,
                          noRedirect: config.noRedirect});

var oauth2Shield = new openamAgent.OAuth2Shield();
policyShield = new openamAgent.PolicyShield(config.appName)

app.get('/test', function (req, res) {
  res.send('<br>' + config.url + '<br>' +
           config.username +  '<br>' +
           config.password);
});

app.get('/protected', agent.shield(cookieShield), function (req, res) {
  res.send('Hello, ' +  req.session.data.username);
});

app.get('/oauth2protected', agent.shield(oauth2Shield), function (req, res) {
    res.send({
        message: 'hello',
        tokenInfo: req.session.data
    });
});

app.listen(config.port, config.bind, function () {
  console.log('Example app listening on port ' + config.port +
              ' and URL ' + config.appUrl);
});
