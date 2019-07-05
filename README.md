# cc2kmz

You'll need node.js and an environment variable with a geocod.io key. It's free as long as you stay under 2500 lookups per day.

````bash
export geocodKey="1234567890abc"
````

Then just run it and it will update the two kml files in the docs folder.

Note that the raw html files from 2600 are total garbage. I fully expect them to change one day and this script will stop working. If that happens, just open an issue (or better yet, a pull request).