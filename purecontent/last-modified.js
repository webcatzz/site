var last_modified = new Date(document.lastModified);
var last_modified_month = last_modified.toLocaleString('default', {month: 'short'});
document.querySelector("span").innerHTML = "[last modified: " + last_modified_month + " " + last_modified.getDate() + "]"
