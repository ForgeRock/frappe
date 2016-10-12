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
