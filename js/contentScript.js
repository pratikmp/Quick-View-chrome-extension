// Author : Pratikkumar Patel PP 

// ContentScripting to load page and make summary and display the context popup.
var title,description,imageSRC,link;
var showTitle,
    showImg,
    showPara;

// Onhover function callback when mouseover event is listened by the link.
function onHover(e){

  var url;
  link=e.target;

  var target = (e.currentTarget) ? e.currentTarget : e.srcElement;
  
  if (target.tagName.toLowerCase() === "a" && target !== undefined) {
      url=target.href;
      e.stopPropagation();
  }

  // Load link page using XMLHttpRequest AJAX.
  loadLink(url,link);

}

// OnHout function callback when mouseout event is listened bt the link.
function onHout(e){

  // Delete/remove the summary div node from the page.
  var span_summary=document.getElementsByClassName('pratspatel_info_summary');

  for (var i = 0; i < span_summary.length; i++) { 
      span_summary[i].parentNode.removeChild(span_summary[i]);
  }

}


function loadLink(url,link){

  // Create XML Http Request
  var httpRequest = new XMLHttpRequest();
  
  // When request state is successfully fetched the page.
  httpRequest.onreadystatechange = function() {
  
  // make sure load is successful and not an error
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      
      var data = httpRequest.responseText;
      
      // Convert the responseText to HTML DOM tree structure.
      var xmlString = data,parser = new DOMParser(), doc = parser.parseFromString(xmlString, "text/html");

      // Fetch page title
      if(showTitle)
        title= getTitle(doc);

      // fetch the image from the linked page
      if(showImg)
        imageSRC=getImage(doc);

      // fetch the small paragraph from the page as summary.
      if(showPara)
        description = getParagraph(doc);

    // Create the span tag using above information. 
    createSPAN(link);


    }

  };
  
  // Open the request
  httpRequest.open("GET", url, true);
  // Send the request.
  httpRequest.send();

}


// Get the Title of the page fromt he title element of the page. If title element is not found : It will displa the link name.
function getTitle(pageData){

  var titleNode=pageData.getElementsByTagName("title")[0].childNodes[0].nodeValue;
   
  if (typeof titleNode != 'undefined')
    return titleNode;
  else{
    return link.value;
  } 
  
}

// Get the biggest image src to display in the summary
function getImage(pageData) {
  
  var maxDimension = 0;
  var maxImage = null;

  // Iterate through all the images.
  var imgElements = pageData.getElementsByTagName('img');
   
  // Measure biggest image by calculating area of the image using width and height attribute mention for the pic.
  for (var index=0;index< imgElements.length;index++) {
    var img = imgElements[index];
    var currDimension = img.getAttribute('width') * img.getAttribute('height');
    if (currDimension  > maxDimension){
       maxDimension = currDimension;
       maxImage = img;
    }
  }
  
  // Check if an image has been found.
  if (maxImage) {
    return maxImage.getAttribute('src');
  }
  // If images doesnt hv width and height then take the first img element of the page to display the pic.
  else if(imgElements[0]){
    return imgElements[0].getAttribute('src');
  }
  // By default if page doesnt hv any image show the information icon
  else{
      return chrome.extension.getURL("images/defaultSummary.jpg");
  }
}

// Get the longest paragraph from the page as the summary of the page.
function getParagraph(pageData) {
  var maxLength = 0;
  var maxP = null;
 
  // Iterate through all the images.
  var pElements = pageData.getElementsByTagName('p');
  for (var index=0; index < pElements.length; index++) {
    var p = pElements[index];
    var plength = p.innerHTML.length;
   
    if (plength  > maxLength && plength < 500 ){
       maxLength = plength;
       maxP = p;
    }
  }
  
  // Check if an image has been found.
  if (maxP) {
    return maxP.innerHTML;
  }
  else if(pElements[0]){
    return pElements[0].innerHTML;
  }
  else{
    return 'Parsing Issue: No paragraph found';
  }
}



function createSPAN(link){

  if(showTitle||showImg||showPara){

    // create the span tage
    var span_tag = document.createElement("span");
    
    //Set class name
    span_tag.className = span_tag.className + "pratspatel_info_summary";
    
    // Set X-Y coordinate to display the span.
    span_tag.style.top=link.clientY;
    span_tag.style.left=link.clientX;
    span_tag.style.width=300+'px';

    // Create img tag
    var imgNode = document.createElement("img");
    imgNode.className=imgNode.className+"extension_icon";
    imgNode.src=chrome.extension.getURL("images/Info-icon.svg");
    imgNode.setAttribute('width', '48');
    imgNode.setAttribute('height', '48');

    // Append the img icon tag in the span.
    span_tag.appendChild(imgNode);


    // Create em tag
    if(showTitle){
      
      var nameNode = document.createElement("em");
      nameNode.appendChild(document.createTextNode(title));
      span_tag.appendChild(nameNode);

    }
    
    // Create img tag
    if(showImg){
    
      // Create img tag and set the image src and size attributes
      var imgNode_linkRelated = document.createElement("img");
      imgNode_linkRelated.id="relatedImg";
      imgNode_linkRelated.src=imageSRC;
      imgNode_linkRelated.setAttribute('width', '75%');
      imgNode_linkRelated.setAttribute('height', '75%');
      // On Error load default image
      imgNode_linkRelated.setAttribute('onerror',"this.onerror=null;this.src='"+chrome.extension.getURL("images/defaultSummary.jpg")+"';");

      // Append to the span tag.
      span_tag.appendChild(imgNode_linkRelated);

    }
  
    // Create Description text node
    if(showPara){
      // Create p element and add the paragraph to innerHTML of the p.
      var divSummarySection = document.createElement('div');
        divSummarySection.className = divSummarySection.className + "relatedinfo_summary";
      
      var descNode = document.createElement('p');
   
      descNode.innerHTML=description;

      // Append the paragraph to the span.
      divSummarySection.appendChild(descNode);
      
      span_tag.appendChild(divSummarySection);
      
    }
  
    // Add span tag
    link.appendChild(span_tag);

  }
}



$(document).ready(function() {
  
  var a_links = document.getElementsByTagName('a');

  // Add MouseOver and MouseOut event listener to all the links of the page.
  for (var i = 0; i < a_links.length; i++) { 
    a_links[i].addEventListener('mouseover', onHover);
    a_links[i].addEventListener('mouseout', onHout);
  }


  // Fetch the custom user setting
  chrome.storage.sync.get(null, function(result) {
  
    showTitle=result.titleDisplay;
    showImg=result.imgDisplay;
    showPara=result.paragraphSummary;
  });

  // Add the onChange Listener on the variable change in the Chrome Storage API used to store extension data.
  chrome.storage.onChanged.addListener(function(changes, namespace) {
      
    for (key in changes) {
    
      var storageChange = changes[key];

      //Set new change of the setting
      switch(key){

        case 'titleDisplay':
          showTitle=storageChange.newValue;
          break;
        
        case 'imgDisplay':
          showImg=storageChange.newValue;
          break;
        
        case 'paragraphSummary':
          showPara=storageChange.newValue;
          break;
      }
    }
  });
});





