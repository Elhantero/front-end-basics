/**
 * How to launch and test
 * use FIREFOX or
 * add --allow-file-access-from-files into CHROME settings
 *
 */

readData("GET", "static/data.json").then(
  function(e) {
    const data = JSON.parse(e.target.response);
    const classNameLeftButton = ".after";
    const classNameRightButton = ".before";

    checkLocalStorage(data, buildListOfbooks);
    counter();
    move(classNameRightButton);
    move(classNameLeftButton);
    filterByAuthor();
    e.preventDefault();
  },
  function(err) {
    console.log(err);
  }
);

// Request for getting data
function readData(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}

// Filter by name of author
function filterByAuthor() {
  const filter = document.querySelector("input");
  filter.addEventListener("keyup", filterBooks);

  function filterBooks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(".item .title").forEach(function(bookItem) {
      const item = bookItem.lastChild.innerText;

      if (item.toLowerCase().indexOf(text) != -1) {
        bookItem.parentElement.style.display = "flex";
      } else {
        bookItem.parentElement.style.display = "none";
      }
    });
  }
}

// Counter for left and right blocks
function counter() {
  const leftCounter = document.querySelector(".leftCounter");
  const rightCounter = document.querySelector(".rightCounter");

  const leftBlock = document.querySelector(".left");
  const rightBlock = document.querySelector(".right");

  leftCounter.innerText = `${leftBlock.childNodes.length}`;
  rightCounter.innerText = `${rightBlock.childNodes.length}`;
}

// Check local storage
function checkLocalStorage(data, callback) {
  var leftBlock;
  var rightBlock;

  document.querySelector("input").value = "";

  if (!localStorage.getItem("leftBlock")) {
    leftBlock = [];
    for (var key in data) {
      leftBlock.push(data[key]);
    }
    localStorage.setItem("leftBlock", JSON.stringify(leftBlock));
  } else {
    leftBlock = JSON.parse(localStorage.getItem("leftBlock"));
  }

  if (!localStorage.getItem("rightBlock")) {
    rightBlock = [];
    localStorage.setItem("rightBlock", JSON.stringify(rightBlock));
  } else {
    rightBlock = JSON.parse(localStorage.getItem("rightBlock"));
  }
  counter();
  callback(leftBlock, rightBlock);
}

// Function move item from one block to another
function move(blockClassStr) {
  let buttons;

  if (blockClassStr === ".before") {
    buttons = document.querySelectorAll(".before");
  } else if (blockClassStr === ".after") {
    buttons = document.querySelectorAll(".after");
  }

  for (var i = 0; i < buttons.length; i++) {
    let button = buttons[i];

    button.onclick = function() {
      var el = this.parentNode;
      var el2 = el.cloneNode(true);
      let div;

      if (blockClassStr === ".before") {
        el2.childNodes[2].className = "after";
        div = document.querySelector(".left");
      } else if (blockClassStr === ".after") {
        el2.childNodes[2].className = "before";
        div = document.querySelector(".right");
      }

      div.appendChild(el2);
      el.parentNode.removeChild(el);

      const authorCheckName = el.childNodes[1].childNodes[0].childNodes[1].data;

      let leftBlock = JSON.parse(localStorage.getItem("leftBlock"));
      let rightBlock = JSON.parse(localStorage.getItem("rightBlock"));

      if (blockClassStr === ".before") {
        for (var i = 0; i < rightBlock.length; i++) {
          if (authorCheckName === rightBlock[i].name) {
            leftBlock.push(rightBlock[i]);
            localStorage.setItem("leftBlock", JSON.stringify(leftBlock));

            rightBlock.splice(i, 1);
            localStorage.setItem("rightBlock", JSON.stringify(rightBlock));
          }
        }
      } else if (blockClassStr === ".after") {
        for (var i = 0; i < leftBlock.length; i++) {
          if (authorCheckName === leftBlock[i].name) {
            rightBlock.push(leftBlock[i]);
            localStorage.setItem("rightBlock", JSON.stringify(rightBlock));

            leftBlock.splice(i, 1);
            localStorage.setItem("leftBlock", JSON.stringify(leftBlock));
          }
        }
      }

      counter();
    };
  }
}

// Build list of books in left and right blocks
function buildListOfbooks(leftBlock, rightBlock) {
  for (var i = 0; i < leftBlock.length; i++) {
    builder(leftBlock[i], ".left");
  }

  for (var i = 0; i < rightBlock.length; i++) {
    builder(rightBlock[i], ".right");
  }
}

// Building of item
function builder(block, blockClassStr) {
  let mainDiv;
  let button;

  if (blockClassStr === ".left") {
    mainDiv = document.querySelector(".left");
    button = document.createElement("div");
    button.className = "after";
  } else if (blockClassStr === ".right") {
    mainDiv = document.querySelector(".right");
    button = document.createElement("div");
    button.className = "before";
  }

  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  const pic = document.createElement("div");
  pic.className = "pic";
  pic.innerHTML = `<img src=${block.img}>`;

  const title = document.createElement("div");
  title.className = "title";

  const name = document.createElement("span");
  const author = document.createElement("span");

  const nameBold = document.createElement("b");
  nameBold.innerHTML = "Название:&nbsp;";

  const authorBold = document.createElement("b");
  authorBold.innerHTML = "Автор:&nbsp;";

  name.appendChild(nameBold);
  const nameText = document.createTextNode(block.name);
  name.appendChild(nameText);

  author.appendChild(authorBold);
  const authorText = document.createTextNode(block.author);
  author.appendChild(authorText);

  title.appendChild(name);
  title.appendChild(author);

  mainDiv.appendChild(itemDiv);
  itemDiv.appendChild(pic);
  itemDiv.appendChild(title);
  itemDiv.appendChild(button);
}
