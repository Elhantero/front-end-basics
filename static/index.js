readData("GET", "static/data.json").then(
  function(e) {
    const data = JSON.parse(e.target.response);

    checkLocalStorage(data, func);
    moveItem();
    moveItem2();
    filter();
    e.preventDefault();
  },
  function(err) {
    console.log(err);
  }
);

function readData(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}

function checkLocalStorage(data, callback) {
  let leftBlock;
  let rightBlock;

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

  callback(leftBlock, rightBlock);
}

function func(left, right) {
  for (var i = 0; i < left.length; i++) {
    const mainDiv = document.querySelector(".left");

    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    const pic = document.createElement("div");
    pic.className = "pic";
    pic.innerHTML = `<img src=${left[i].img}>`;

    const title = document.createElement("div");
    title.className = "title";

    const name = document.createElement("span");
    const author = document.createElement("span");

    const nameBold = document.createElement("b");
    nameBold.innerHTML = "Название: ";

    const authorBold = document.createElement("b");
    authorBold.innerHTML = "Автор: ";

    name.appendChild(nameBold);
    const nameText = document.createTextNode(left[i].name);
    name.appendChild(nameText);

    author.appendChild(authorBold);
    const authorText = document.createTextNode(left[i].author);
    author.appendChild(authorText);

    title.appendChild(name);
    title.appendChild(author);

    const button = document.createElement("div");
    button.className = "after";

    mainDiv.appendChild(itemDiv);
    itemDiv.appendChild(pic);
    itemDiv.appendChild(title);
    itemDiv.appendChild(button);
  }

  for (var i = 0; i < right.length; i++) {
    const mainDiv = document.querySelector(".right");

    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    const pic = document.createElement("div");
    pic.className = "pic";
    pic.innerHTML = `<img src=${right[i].img}>`;

    const title = document.createElement("div");
    title.className = "title";

    const name = document.createElement("span");
    const author = document.createElement("span");

    const nameBold = document.createElement("b");
    nameBold.innerHTML = "Название: ";

    const authorBold = document.createElement("b");
    authorBold.innerHTML = "Автор: ";

    name.appendChild(nameBold);
    const nameText = document.createTextNode(right[i].name);
    name.appendChild(nameText);

    author.appendChild(authorBold);
    const authorText = document.createTextNode(right[i].author);
    author.appendChild(authorText);

    title.appendChild(name);
    title.appendChild(author);

    const button = document.createElement("div");
    button.className = "after";

    mainDiv.appendChild(itemDiv);
    itemDiv.appendChild(pic);
    itemDiv.appendChild(title);
    itemDiv.appendChild(button);
  }
}

function moveItem() {
  const buttons = document.querySelectorAll(".after");
  for (var i = 0; i < buttons.length; i++) {
    let button = buttons[i];

    button.onclick = function() {
      let el = this.parentNode;
      let el2 = el.cloneNode(true);
      el2.childNodes[2].className = "before";

      const div = document.querySelector(".right");
      div.appendChild(el2);
      el.parentNode.removeChild(el);
      moveItem2();

      const a = el.childNodes[1].firstElementChild.innerHTML;

      let leftBlock;
      leftBlock = JSON.parse(localStorage.getItem("leftBlock"));
      let rightBlock;
      rightBlock = JSON.parse(localStorage.getItem("rightBlock"));

      for (var i = 0; i < leftBlock.length; i++) {
        if (a === leftBlock[i].name) {
          rightBlock.push(leftBlock[i]);
          localStorage.setItem("rightBlock", JSON.stringify(rightBlock));

          leftBlock.splice(i, 1);
          localStorage.setItem("leftBlock", JSON.stringify(leftBlock));
        }
      }
    };
  }
}

function moveItem2() {
  const buttons = document.querySelectorAll(".before");
  for (var i = 0; i < buttons.length; i++) {
    let button = buttons[i];

    button.onclick = function() {
      var el = this.parentNode;
      var el2 = el.cloneNode(true);
      el2.childNodes[2].className = "after";

      const div = document.querySelector(".left");
      div.appendChild(el2);
      el.parentNode.removeChild(el);
      moveItem();

      const a = el.childNodes[1].firstElementChild.innerHTML;

      let leftBlock;
      leftBlock = JSON.parse(localStorage.getItem("leftBlock"));
      let rightBlock;
      rightBlock = JSON.parse(localStorage.getItem("rightBlock"));

      for (var i = 0; i < rightBlock.length; i++) {
        if (a === rightBlock[i].name) {
          leftBlock.push(rightBlock[i]);
          localStorage.setItem("leftBlock", JSON.stringify(leftBlock));

          rightBlock.splice(i, 1);
          localStorage.setItem("rightBlock", JSON.stringify(rightBlock));
        }
      }
    };
  }
}

function filter() {
  const filter = document.querySelector("input");
  filter.addEventListener("keyup", filterTasks);

  function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(".item .title").forEach(function(task) {
      const item = task.lastChild.innerText;
      if (item.toLowerCase().indexOf(text) != -1) {
        task.parentElement.style.display = "flex";
      } else {
        task.parentElement.style.display = "none";
      }
    });
  }
}
