// ------------------
// Community editor
// ------------------

// Imported content from JSON files

// Load the HTML block list (used to find HTML that should not be there, and subsequent replacements)
async function loadJson() {
	url = chrome.runtime.getURL("json/htmlblock.json");
	response = await fetch(url).then((response) => { 
		return response.json();
	})
	.then((data) => {
		htmlrules = data;
		console.log("Data: ");
		console.log(data);
		console.log("End of data.");
	});
}

// Basic variables

editor = null;
toolbar = null;
htmlrules = null;

// HTML to add to the editor

addhtml = '<button type="button" title="Clean HTML" class="p-1.5 rounded hover:bg-fortinet-grey transition-colors disabled:opacity-40 disabled:pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toastbutton cleanup_button" aria-hidden="true"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="m17 12 3-2v8"></path></svg></button>';

// ------------------
// Functions
// ------------------

// Things to do when initialized on the editor page
function onInit() {
	loadJson();
}

onInit(); // Call the init function

// Things to do after the editor has loaded/the delay
function onDelayedInit() {
	possibleEditors = document.getElementsByClassName("ProseMirror");
	editor = possibleEditors[0];
	doFormat();
}

// ------------------
// Function calls
// ------------------

// Currently, call the delayed init function after an 800ms delay 
// To be ideally changed later to some kind of "onload" function - this is a hack-y temporary method because onload and dom functions didn't seem to work???
setTimeout(function() {
	onDelayedInit();
},800);

// Iterate through the blocked HTML JSON, and address issues as described
function doFormat() {
	var replacement = editor.innerHTML;
	for (i=0;i<htmlrules.rules.length;i++) {
		replacement = replacement.replaceAll(htmlrules.rules[i].match, htmlrules.rules[i].replace);
		
	}
	editor.innerHTML = replacement;
	alert(replacement);
	console.log(editor.innerHTML);
}