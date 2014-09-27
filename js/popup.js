// Author : Pratikkumar Patel PP 
// Popup JS to script the Setting popup page
var titleDisplay,imgDisplay,paragraphSummary;

// Load the user custom option setting in the popup setting display panel
function loadOptions() {

	// If setting data is not synced and fetches undefine from the Chrome Storage API : Use default setting: Show everything.
	if (titleDisplay == undefined) {
		titleDisplay = true;
	}

	if (imgDisplay == undefined) {
		imgDisplay = true;
	}

	if (paragraphSummary == undefined) {
		paragraphSummary = true;
	}

// Set the Checkbox field according to the setting enabled by the user.
$( "input" ).each(function( index ) {
 
 	$(this).removeProp('checked');
			
 	switch($(this).attr('id')){

			case 'titleDisplay':
				if(titleDisplay===true){$(this).attr('checked', 'checked');}
				break;
			
			case 'imgDisplay':
				if(imgDisplay===true){$(this).attr('checked', 'checked');}
				break;
			
			case 'paragraphSummary':
				if(paragraphSummary===true){$(this).attr('checked', 'checked');}
				break;

		}

});

	
}

// Save the setting if any change is made. This function is called by the eventListner on chenage on checkbox inputs.
function saveOption(e){
 
 	// Get the input target field
 	var target = (e.currentTarget) ? e.currentTarget : e.srcElement;
        
 	if (target.tagName.toLowerCase() === "input" && target !== undefined) {
        e.stopPropagation();
 	} 

 	var check=(target.getAttribute('checked')=='checked')?true:false;
  	var save = {};
	save[target.value] = !check;
	
	// Store the setting in  the Chrome Storage API
	chrome.storage.sync.set(save,function(){});

	if(check){
		target.removeAttribute('checked');
	}
	else
	{
		target.setAttribute('checked','checked');
	}
    

}


document.addEventListener('DOMContentLoaded', function () {
	
	var checkBox = document.getElementsByTagName("input");
  	
  	// Add change listener to all the checkbox to save setting immediately on change in the checkbox by the user.
  	for (var i = 0; i < checkBox.length; i++) { 
    	checkBox[i].addEventListener('change', saveOption);
  	}

  	// Fetch the setting from the Chrome Storage API to display in the popup display
  	chrome.storage.sync.get(null, function(result) {

		titleDisplay=result.titleDisplay;
		imgDisplay=result.imgDisplay;
		paragraphSummary=result.paragraphSummary;
 		
 		loadOptions();

	});

  	// Add the onChange Listener on the variable change in the Chrome Storage API used to store extension data.
	chrome.storage.onChanged.addListener(function(changes, namespace) {
        
        for (key in changes) {
          	var storageChange = changes[key];

          	// Set new value to the existing variable.
       		switch(key){

      			case 'titleDisplay':
      				titleDisplay=storageChange.newValue;
      				break;
      
      			case 'imgDisplay':
      				imgDisplay=storageChange.newValue;
      				break;
      
      			case 'paragraphSummary':
      				paragraphSummary=storageChange.newValue;
      				break;

    		}
    	}
    	
    	loadOptions();
    
    });

 
});




