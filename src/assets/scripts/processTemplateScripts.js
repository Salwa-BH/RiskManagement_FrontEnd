function openTab(evt, tabId) {
  let i, tabcontent, tablinks;
  // Hide all content
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove active class from all the tab links
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  activateParentTablink(tabId);
  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.className += " active";
}

function activateParentTablink(tabId) {
  let parent = document.getElementById(tabId).parentNode;
  if (parent.className.includes("tabcontent") == true) {
    activateParentTablink(parent.id);
    parent.style.display = "block";
  }
}