const fetch = require('fetch');
const fs = require('fs');
var NodeGeocoder = require('node-geocoder');
  
const options = {
  provider: 'geocodio',
  apiKey: process.env.geocodKey
};

var geocoder = NodeGeocoder(options);
let kmlTemplate = fs.readFileSync('./template.kml', {encoding: 'UTF8'});

const cbpRules = {
  splitter: '<p class="P2">',
  titleRE: /class="T1">([^<]+)/,
  addressRE: /class="T2">([^<]+)/
};

const iceRules = {
  splitter: '<p style="margin: 0cm; line-height: 100%"><br/>',
  titleRE: /"font-size: 12pt"><b>([^<]+)/,
  addressRE: /<p style="margin: 0cm; line-height: 100%"><font size="3" style="font-size: 12pt"><font face="Times New Roman, serif"><font size="3" style="font-size: 12pt">([^<]+)/
};

convert("http://concentrationcamps.us/cbp.html", "Customs and Border Patrol", "./docs/cbp.kml", cbpRules, "#icon-1899-A52714-nodesc");
//convert("http://concentrationcamps.us/ice.html", "ICE Detention Facilities", "./docs/idf.kml", iceRules, "#icon-1899-0288D1-nodesc"); 

async function convert(url, title, path, rules, icon) {
  
  fetch.fetchUrl(url, async (error, meta, body) => {
    let placemarksString = '';
    let data = body.toString();
    data = data.split(rules.splitter);
    
    await asyncForEach(data, async (loc) => {
      loc = loc.replace(/(\r\n|\n|\r)/gm," ");
      const title = loc.match(rules.titleRE);
      let address;
      if (title) {
        address = loc.substring(title.index + 1).match(rules.addressRE);
      }
      if (title && address) {
        console.log(`Mapping ${title[1]}`);
        
        // I suck at regex. I'm sure this could be improved.
        const cityStateZip = loc.substring(title.index + address.index+3).match(rules.addressRE);
        const phone = loc.substring(title.index + cityStateZip.index+address.index+4).match(rules.addressRE);
        let fax = loc.substring(title.index + phone.index + cityStateZip.index+address.index+5).match(rules.addressRE); 
        if (!fax) fax = [null, "", loc.length];

        const geoCoded = await geocoder.geocode(`${address[1]} ${cityStateZip[1]}`);
        if (geoCoded.length > 0) {
          placemarksString += `<Placemark><name>${title[1]}</name><description><![CDATA[${address[1]}<br>${cityStateZip[1]}<br>Phone: ${phone[1]}<br>Fax : ${fax[1]}]]></description><styleUrl>${icon}</styleUrl><Point><coordinates>${geoCoded[0].longitude},${geoCoded[0].latitude},0</coordinates></Point></Placemark>`;
        } else {
          console.log(`Could not geocode ${title[1]}`);
        } 
      }
    })

    let result = kmlTemplate.replace('{title}', title).replace('{placemarks}', placemarksString);
    fs.writeFileSync(path, result);

  })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}