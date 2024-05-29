var dots = document.querySelectorAll(".preview_img_link");

for(var i = 0; i < dots.length; i ++){
dots[i].dotIndex = i;
dots[i].addEventListener("click", function(){
  console.log(this.dotIndex)
  var a = this.dotIndex;
  console.log(this.dotIndex);
  const copied = document.getElementById(a)
  const nodeHeight = copied.offsetHeight;
  const nodeWidth = copied.offsetWidth;
  const nodeTop = copied.getBoundingClientRect().top;
  const nodeLeft = copied.getBoundingClientRect().left;
  var clonedNode = copied.cloneNode(true);
  clonedNode.id = "node_clone";
  document.body.appendChild(clonedNode);
  clonedNode.style.setProperty('--width', nodeWidth);
  clonedNode.style.setProperty('--height', nodeHeight);
  clonedNode.style.setProperty('--top', nodeTop);
  clonedNode.style.setProperty('--left', nodeLeft);
})
}

function delay (URL) {
  setTimeout( function() { window.location = URL }, 700 );
}
