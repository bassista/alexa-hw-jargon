# alexa-hw-jargon

This is a template for an Alexa ASK skill that supports multiple languages. 
It is the equivalent to the Hello World template, but with support for es-MX, ca-FR, and en-US. <br>
From there it should be easy to add languages by copying files and settings. See guidance below<br > 

It uses [@jargon/sdk-core](https://www.jargon.com/sdk/) for the localization.  
Core is just a subset of jargon. I use the ResourceManager to localize the strings without using their responsebuilder or their injectors. 
Check out their docs and [ASK templates](https://s3.amazonaws.com/jargon-templates/ask-nodejs.json) for an alternate approach to mine. 
I am still getting familiar with Jargon, so wanted the least obtrusive approach, and this felt right. 

## How to clone from ask cli 
ask new --url https://github.com/jaimerodriguez/alexa-hw-jargon 


## How to add support for more locales 
If you need to add support for more locales, here is that you need to do:
1. Edit skill.json to add new locale. Just copy one of the locale sections and use that as a base for yours. Override the settings, keep the structure. 
1. Add the locale model in the ./models folder. Again, easiest way is to use an existing model file (en-US) and use it for your locale. 
1. Add the new locale strings in the ./lambda/custom/resources folder.



