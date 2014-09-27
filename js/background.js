// Author : Pratikkumar Patel PP 


// Initialize the Default setting when extension is hosted
chrome.runtime.onInstalled.addListener(function(details){


// Default setting
chrome.storage.sync.set({'titleDisplay':true},function(){
	console.log("Setting default showTitle");
});

chrome.storage.sync.set({'imgDisplay':true},function(){
	console.log("Setting default imgDisplay");});

chrome.storage.sync.set({'paragraphSummary':true},function(){
	console.log("Setting default paragraphSummary");});
    
});
