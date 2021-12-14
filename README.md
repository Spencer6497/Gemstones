# Gemstones
Simple MagicMirror module that uses a web scraper to display a different, random mineral every day to the user.

# Example
![alt text](https://github.com/Spencer6497/gemstones/blob/master/images/Screenshot.png?raw=true)

## Instructions
```
cd ~MagicMirror/modules
git clone "https://github.com/Spencer6497/gemstones.git"
cd /gemstones
npm install
```
## Configuration
As of now, configuration is very simple. Add the following to your MagicMirror's config.js:
```
{
            module: 'gemstones',
            disabled: false,
            position: 'middle_center'
},
```
