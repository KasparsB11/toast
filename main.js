// ------------------
// Community editor
// ------------------

// QA function

const tlogSwitch = 1; // 1 for logs on, 0 for logs off
function tlog(a) {
	if (tlogSwitch == 1) {
		console.log("Toast output>>>>>>>");
		console.log(a);
	}
}

// Imported content from JSON files

// Load the HTML block list (used to find HTML that should not be there, and subsequent replacements)
async function loadJson() {
	// Import title rules
	url = chrome.runtime.getURL("json/title.json");
	response = await fetch(url).then((response) => { 
		return response.json();
	})
	.then((data) => {
		titlereplace = data;
		console.log("Title replace list: ");
		console.log(data);
		console.log("End of title replace list.");
	});
	url = chrome.runtime.getURL("json/htmlblock.json");
	response = await fetch(url).then((response) => { 
		return response.json();
	})
	.then((data) => {
		htmlrules = data;
		tlog("HTML blocklist: ");
		tlog(data);
		const container = document.getElementById("rulesContainer");
		container.innerHTML = data.rules
			.map(rule => `
			<div>
				<input type="checkbox" id="rule-${rule.rule}" value="${rule.rule}">
				<label for="rule-${rule.rule}">${rule.rulename}</label>
			</div>
			`)
			.join("");
		
		``
		tlog("End of HTML blocklist.");
		//tlog(tRule);
		//return JsonTRules;
	});

}

// Basic variables

editor = null;
toolbar = null;
htmlrules = null;
htmlallow = null;
titlereplace = null;
title = null;


// HTML to add to the editor

addhtml = '<button type="button" title="Clean HTML" class="p-1.5 rounded hover:bg-fortinet-grey transition-colors disabled:opacity-40 disabled:pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toastbutton cleanup_button" aria-hidden="true"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="m17 12 3-2v8"></path></svg></button>';

// ------------------
// Functions
// ------------------

// Things to do when initialized on the editor page
function onInit() {
	tlog("======starting TOAST");
	loadJson();
}

onInit(); // Call the init function

// Things to do after the editor has loaded/the delay
function onDelayedInit() {
	console.log("Running delayed init.");
	possibleEditors = document.getElementsByClassName("ProseMirror");
	editor = possibleEditors[0];
	let title = document.getElementById("title"); // This is an input field, so value should be modified rather than innerHTML (maybe both work, idk)
	doTitleReplace();
	// The general format function is paused
	//doFormat();
}

$(document).on("click", function() {
	doTitleReplace();
});

// ------------------
// Function calls
// ------------------

// Currently, call the delayed init function after an 800ms delay 
// To be ideally changed later to some kind of "onload" function - this is a hack-y temporary method because onload and dom functions didn't seem to work???
setTimeout(function() {
	onDelayedInit();
},800);

// Remove X Tip before title. 
function doTitleReplace() {
	if (document.getElementById("title")) {
		title = document.getElementById("title");
		var replacement = title.value;
		//console.log("Title field is "+replacement);
		for (i=0;i<titlereplace.rules.length;i++) {
			replacement = replacement.replaceAll(titlereplace.rules[i].match, titlereplace.rules[i].replace);
		}
		document.getElementById("title").value = replacement;
		title.dispatchEvent(new Event("input", { bubbles: true}));
		title.dispatchEvent(new Event("change", { bubbles: true}));
		//console.log(replacement);
	}
} 

// Iterate through the blocked HTML JSON, and address issues as described
function doFormat() {
	var replacement = editor.innerHTML;
	// Temporary replacement to preserve HTML that should be shielded from the blocklist
	// For example: turn "font-family: Courier New;" into "_TEMP_COURIERNEW_" before mass font-family removal
	for (i=0;i<htmlallow.rules.length;i++) {
		replacement = replacement.replaceAll(htmlallow.rules[i].match, htmlallow.rules[i].replace);
	}
	// Replace HTML content outlined in the HTML blocklist
	// For example: Strip all instances of "font-family: <fonts>;"
	for (i=0;i<htmlrules.rules.length;i++) {
		replacement = replacement.replaceAll(htmlrules.rules[i].match, htmlrules.rules[i].replace);
	}
	// Restore the temporary replaced content from  HTML allowlist
	// For example: return "_TEMP_COURIERNEW_" to "font-family: Courier New;"
	for (i=0;i<htmlallow.rules.length;i++) {
		replacement = replacement.replaceAll(htmlallow.rules[i].replace, htmlallow.rules[i].restore);
	}
	editor.innerHTML = replacement;
	tlog(replacement);
	tlog(editor.innerHTML);
}
