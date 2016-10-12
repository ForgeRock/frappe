frappé
============
ForgeRock Application Example for the CloudFoundry Service Broker combined with node-agent

This is a sample application that you can run locally or in a CloudFoundry PaaS. Teh application is written in node.js and it is just a sample. It uses the openam-agent module written by my colleague Zoltan Tarcsay and you can find the code and more information on how to use it here: https://www.npmjs.com/package/openam-agent  


# Installation
Clone this repo:

```git clone```

Change to the application directory

```# cd frappe```

Install the dependencies

```# npm install```

## Running Locally
If running locally be sure you have defined your environemntal variables before starting it:

If running in a Unix-like (Linux, BSD, OSX, etc) operating system you can set your environmental variables like this, but check with your OS for precise instructions:

```
# export username=my-node-agent-user-name
# export password=my-node-agent-password
# export openamBaseUrl='http://openam1.example.com:8080/openam'
```
There are additional optional variables, check setenv-example.sh for more info.

Of course need an OpenAM to be up, running, reachable and resolvable. Also remember that if you want to use the agent in its simplest form together with the OpenAM, then it helps to have both the OpenAM and the application in the same DNS domain, otherwise you will need to use CDSSO, which needs you to configure it with CDSSO enabled.

In the OpenAM you will need an agent identity to be created that matches the configuration of username and password defined above.

If running locally you can now start the app:

```# node start```

¡listo! voilà! ready! pronto!   

Now open your browser and go to your application URL and try for example:
```
http://frappe.example.com:6001/protected
http://frappe.example.com:6001/test
```

## Running in CloudFoundry

For CloudFoundry you will need the OpenAM Service Broker. The code is available here: https://stash.forgerock.org/projects/CLOUD/repos/cloudfoundry-service-broker/browse

The Service Broker was designed to work with OpenAM configured as an OAuth2 Provider, but when cobined with the openam-node-agent then you can use OpenAM also without OAuth2.

### Install the Service Broker
Check the code out and follow the instructions described in the repo

### Push the app
Be sure you are using cloud foundry:
```
$ cf target

API endpoint:   https://api.local.pcfdev.io (API version: 2.58.0)
User:           admin
Org:            pcfdev-org
Space:          pcfdev-space
```

For the pure agent functionality you need the application and the OpenAM running in the same domain if you do not use cdsso

Change to the directory where this app is:
```
$ cd frappe
```

Push the app:
```
$ cf push frappe -c "node app.js" -m 256m

Updating app frappe in org pcfdev-org / space pcfdev-space as admin...
OK

Uploading frappe...

.... lots of message ...

App frappe was started using this command `node app.js`

Showing health and status for app frappe in org pcfdev-org / space pcfdev-space as admin...
OK

requested state: started
instances: 1/1
usage: 256M x 1 instances
urls: frappe.local.pcfdev.io, frappe.example.com
last uploaded: Wed Oct 12 09:54:05 UTC 2016
stack: cflinuxfs2
buildpack: node.js 1.5.15

     state     since                    cpu    memory          disk          details
#0   running   2016-10-12 11:54:54 AM   0.0%   43.2M of 256M   78M of 512M

$
```
### Observations
If you want the *frappe* application running in the same domain than the OpenAM, and you need to add that domain, and route in CLoudFoundry, then you might need to use these commands:

To create an additional domain in your CF organization:
```
cf create-domain pcfdev-org example.com
```

To create a route frappe.example.com:
```
cf map-route frappe example.com --hostname frappe
```

Also be sure that your CF (PCF Dev in my case), can reach the OpenAM. In the case of PCF Dev remember that it runs in 192.168.11.11 since it uses VirtualBox.Your OPenAM most probably needs to bind to 192.168.11.1 and be resolvable for that IP address

*Note*: At the time of writing this readme, PCF Dev was able to use the following versions of npm and node. Newer versions were not possible:
```
"node": "6.2.1",
"npm": "3.10.7"
```
