# cc2kml

You'll need node.js and an environment variable with a geocod.io key. It's free as long as you stay under 2500 lookups per day.

````bash
export geocodKey="1234567890abc"
````

Then just run it and it will parse the HTML from 2600, Geocode all the addresses, and then update the two kml files in the docs folder.

````bash
node index
````

Note that the raw html files from 2600 are total garbage. I fully expect them to change one day and this script will stop working. If that happens, just open an issue (or better yet, a pull request).

Those KML files can be uploaded directly into your own map at Google, or used however you want.

[Here's a live map](https://t.co/hDRTbMlcWd)
* Two layers, one for ICE Detention Facilities and one for Customs and Border Patrol Stations
* Click on an icon to get address, phone number and fax number
