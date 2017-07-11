.TODO: Change project to follow this:

Recommended way in 2017 / Typescript 2.x:

    Create your project as you normally would (with tests and everything)
    Add declaration: true to tsconfig.json to generate typings.
    Export the API through an index.ts
    In the package.json, point to your generated typings. For example if your outDir is dist, then add "types": "dist/index.d.ts" to your package json.
    Create an .npmignore to ignore unnecessary files (e.g. the source).
    Publish to npm with npm publish. Use semvar specifications for updates (patch / bug fix npm version patch, non-breaking additions npm version minor, breaking api changes npm version major)

Since it got me a while to sift through all the outdated resources on this topic on the internet (like the one on this page...) I decided to wrap it up in how-to-write-a-typescript-library.com with an up-to-date working minimal example.


http://www.tsmean.com/how-to-write-a-typescript-library/
