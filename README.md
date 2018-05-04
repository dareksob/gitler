# gitler
An command line git tool to handle revisions of project.

## Installation

```` 
npm i --global github:dareksob/gitler
````

## How to use 

### Using as command line

Show you current details of package version and git version

```
gitler status 
```

### Using as API for your custom node script

```` 
const gitler = require('gitler');
gitler
    .tag()
    .then(tagModel => {
        // do what you whant
    });
````

## Commands overview


### gitler status

Detail information of current version


### gitler tag

Get current git version as object

```
{ 
    full: 'v1.0.0',
    fullVersion: 'v1.0.0',
    prefix: 'v',
    version: '1.0.0',
    productionIndex: '1',
    sprintIndex: '0',
    releaseIndex: '0',
    data: undefined 
}
```


## gitler versionRecommendation

Get the next recommended version as object

```` 
{ oldVersion: '1.0.0', newVersion: '1.0.1' }
````

## gitler updatePackage

Update the next recommended version inside your package.json