module.exports.datapubs = {

  "sites": {
  	"staging": {
      "dir": "/publication/staging_ocfl",
      "url": "http://localhost:8080/staging"
    },
  	"public": {
      "dir": "/publication/public_ocfl",
      "url": "http://localhost:8080/public"
    }
  },

  "metadata": {
  	"html_filename": "ro-crate-preview.html",
    "jsonld_filename": "ro-crate-metadata.jsonld",
    "datapub_json": "datapub.json",
    "render_script": "https://data.research.uts.edu.au/examples/ro-crate/examples/src/crate.js",
    "organization": {
      "id": "https://www.uts.edu.au/",
      "name": "University of Technology Sydney"
    }
  }

};
