# This application uses the node-agent () and can use also the CloudFoundry
# Service Broker, so it can run locally or in the CF PaaS
#
# For more info on the node-agent see: https://www.npmjs.com/package/openam-agent
# and the wiki referenced there
#
# When using locally, you need to create an OAuth 2.0 Client (Agent) manually and set the credentials as environemntal variables:
# The credentials for an agent (a 2.2 Agent  should suffice)
# When running in CloudFoundry, this env variables are not necessary
export username=my-node-agent-user-name
export password=my-node-agent-password
# The OpenAM Base URL
export openamBaseUrl='openam1.example.com:8080/openam';
export appUrl='http://frappe.example.com:6001'
export notificationRoute='/'
export notificationsEnabled=false
export realm='/'
export logLevel='info'
export cdsso=false
export getProfiles=true
export noRedirect=false
