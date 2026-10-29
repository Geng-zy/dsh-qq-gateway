// Explicit developer action; only reads public upstream files. Never runs downloaded content.
import{writeFileSync}from'node:fs';import{parse}from'yaml';import{createHash}from'node:crypto';
const root=new URL('../',import.meta.url),headers={'user-agent':'dsh-public-upstream-inventory',...(process.env.GITHUB_TOKEN?{authorization:'Bearer '+process.env.GITHUB_TOKEN}:{})};
async function file(repo,path){const url='https://api.github.com/repos/'+repo+'/contents/'+path;const r=await fetch(url,{headers,redirect:'error',signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(url+' HTTP '+r.status);const j=await r.json();if(j.encoding!=='base64')throw Error('Expected public file content');const text=Buffer.from(j.content,'base64').toString('utf8');return{url,sha:j.sha,sha256:createHash('sha256').update(text).digest('hex'),text}}
const docker=await file('SnowLuma/SnowLuma.Docker.Framework','Dockerfile'),lock=await file('SnowLuma/SnowLuma','pnpm-lock.yaml');
const d=parse(lock.text),packages=Object.keys(d.packages??{}).map(k=>/^(.+)@(\d[^()]*)/.exec(k)).filter(Boolean).map(m=>({name:m[1],version:m[2]}));
const apt=[...docker.text.matchAll(/apt-get install -y --no-install-recommends\s+([\s\S]*?)(?:&&|\n\s*RUN)/g)].flatMap(m=>m[1].replace(/\\/g,' ').split(/\s+/).filter(x=>/^[a-z][a-z0-9+.-]+$/.test(x)));
const suite=/FROM node:[^\n]*?-([a-z]+)-slim/.exec(docker.text)?.[1]??'bookworm';
const snapshot={schema:1,checkedAt:new Date().toISOString(),dockerfile:{url:docker.url,sha:docker.sha,sha256:docker.sha256,suite,aptPackages:[...new Set(apt)].sort(),qqVersion:/ARG QQ_VERSION=([^\s]+)/.exec(docker.text)?.[1]},snowlumaLock:{url:lock.url,sha:lock.sha,sha256:lock.sha256,packages}};
writeFileSync(new URL('docs/UPSTREAM-SNAPSHOT.json',root),JSON.stringify(snapshot,null,2)+'\n');console.log('Public snapshot:',snapshot.dockerfile.aptPackages.length,'image packages,',packages.length,'public upstream npm records')
