/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const Jargon  = require('@jargon/sdk-core');

const i18n = 
{    
    resourceMangementFactory : new Jargon.DefaultResourceManagerFactory({}) , 
    resourceManager : null , 
    activeLocale : '' , 
    LocaleInterceptor (handlerInput ) 
    {        
      this.activeLocale = handlerInput.requestEnvelope.request.locale;   
      this.resourceManager = this.resourceMangementFactory.forLocale(this.activeLocale); 
    }, 

    async ri ( key, params, options  ) 
    { 
      let riResult = Jargon.ri( key, params , options);       
      return this.resourceManager.render(riResult);        
      
    }, 
    getMultiLocalePath ( resourceName )
    { 
      return resourceName + "." + this.activeLocale.replace("-", "."); 
    }
}; 

const ri =  (k,p,o) => { return i18n.ri (k,p,o);}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {

    // Sample code using Jargon's resource dictionary without the i18n wrapper. 
    // const rf = new Jargon.DefaultResourceManagerFactory({}) ; 
    // const rm = rf.forLocale('en-US'); 
    // const contentPromise = rm.render(Jargon.ri('WELCOME'));      
    // const result = await contentPromise; 

    const speechText = await ri('WELCOME');
    const title = await ri('CARD_TITLE'); 
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(title , speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  async handle(handlerInput) {

    const speechText = await ri('SKILL_NAME');
    const title = await ri("CARD_TITLE"); 
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard( title , speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  async  handle(handlerInput) {
    const speechText = await ri('HELP_INSTRUCTIONS');
    const title = await ri('CARD_TITLE'); 
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard( title , speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  async handle(handlerInput) {
    const speechText = await ri ('GOODBYE');
    const title = await ri('CARD_TITLE'); 
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard( title, speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  async handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const errorMesage = await ri('ERROR_REPEAT'); 
    return handlerInput.responseBuilder
      .speak( errorMesage)
      .reprompt(errorMesage)
      .getResponse();
  }
};


const LocaleIntentHandler =  
{ 
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LocaleIntent';
  },
  async handle(handlerInput) {    
    const multiLocalePath = i18n.getMultiLocalePath('locale'); 
    const localeValueResolved = await ri( multiLocalePath ); 
    const speechText = await ri ('SAMPLE_VARIABLE_EXPANSION', {localeName : localeValueResolved });
    const title = await ri("CARD_TITLE"); 

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(title, speechText)
      .getResponse();
  },

}


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    LocaleIntentHandler, 
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler 
  )
  .addRequestInterceptors ( (x) => i18n.LocaleInterceptor(x) ) 
  .addErrorHandlers(ErrorHandler)
  .lambda();
