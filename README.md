WGSA Front End
==========

Front end code for the WGSA system.

Install
----------------
`npm install`

Run
----------------
`sudo node app`

Open `http://localhost` in your browser.

### Supported FASTA file extensions
* .fa
* .fas
* .fna
* .ffn
* .faa
* .frn
* .contig

Troubleshooting
----------------
When the node app runs as expected, but the page doesn't look/work as expected then it's very likely that your browser serves cached (i.e. old) js/css files. To validate, open Incognito Window in Chrome or disable cache in Chrome Developer Tools (Cmd + Alt + I > Settings > Disable cache) and reload your page.

If that didn't help, check if you get JS error in Chrome Developer Tools Console (Cmd + Alt + J).
