const core = require('@actions/core');
const github = require('@actions/github');
const querystring = require('querystring');

async function getIDTokenAction() {
  
    const audience = core.getInput('audience', {required: false})
    
    const id_token1 = await core.getIDToken()            // ID Token with default audience
    const id_token2 = await core.getIDToken(audience)    // ID token with custom audience
    console.log("printing tokens ")
    console.log(id_token1)
    console.log(id_token2)
    core.setOutput("id_token1", id_token1);
    core.setOutput("id_token2", id_token2);
    // this id_token can be used to get access token from third party cloud providers
 }
getIDTokenAction()

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();

  // INPUTS
  const deployment_type = core.getInput('deployment_type');
  const factory_cluster = core.getInput('factory_cluster');
  const deployment_path = core.getInput('deployment_path');

  console.log(process.env.GITHUB_REPOSITORY)
  console.log(time)
  //core.setOutput("time", time);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  
  //Build Body
  const body = `{
    "project_metadata":{
       "name":${process.env.GITHUB_REPOSITORY},
       "github_actions_token":${id_token1},
       "git_sha":${process.env.GITHUB_SHA},
       "git_branch":${process.env.GITHUB_REF_NAME},
       "owner":${process.env.GITHUB_ACTOR},
       "project_owners":[
        ${process.env.GITHUB_REPOSITORY_OWNER}
       ]
    },
    "deployment_metadata":{
       "deployment_type":${deployment_type},
       "deployment_path":${deployment_path},
       "factory_cluster":${factory_cluster},
       "factory_environment":${process.env.FACTORY_ENVIRONMENT}
    }
  }`

  console.log(`BODY1 IS : ${body}`)
  const postBody = querystring.stringify(body);


  // HTTP POST request
  const XMLHttpRequest = require('xhr2');
  const  xhr = new XMLHttpRequest();
  xhr.open("POST", "https://httpbin.org/post");

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = () => console.log(xhr.responseText);
  xhr.send(body);

  xhr.onreadystatechange = (e) => {
  console.log(xhr.responseText)
  }
  
} catch (error) {
  core.setFailed(error.message);
}


