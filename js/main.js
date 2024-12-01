function createElemWithText(sName, tContent, cName) {
    this.stringName = "p";
    this.textContent = "";
    this.className = "";

    if (sName !== undefined)
        this.stringName = sName;
    if (tContent !== undefined)
        this.textContent = tContent;
    if (cName !== undefined)
        this.className = cName;

    const newElem = document.createElement(stringName);
    newElem.textContent = this.textContent;
    if (className !== "")
        newElem.className = this.className;

    return newElem;
}

function createSelectOptions(data) {
    if (data === undefined)
        return undefined;

    const arr = data.map((user) => {
        const optionElem = document.createElement("option");
        optionElem.value = user.id;
        optionElem.textContent = user.name;
        return optionElem;
    });

    return arr;
}

function toggleCommentSection(postId) {
    if (postId === undefined)
        return undefined;
    const sectionElem = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!sectionElem)
        return null;
    sectionElem.classList.toggle('hide');
    return sectionElem;
}

function toggleCommentButton(postId) {
    if (postId === undefined)
        return undefined;
    const buttonElem = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!buttonElem)
        return null;
    if (buttonElem.textContent === "Show Comments")
        buttonElem.textContent = "Hide Comments";
    else
        buttonElem.textContent = "Show Comments";
    return buttonElem
}

function deleteChildElements(parentElement) {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild;
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners() {
    const main = document.querySelector("main");
    const buttonArr = main.querySelectorAll("button");
    if (buttonArr.length === 0)
        return null;
    buttonArr.forEach((button) => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener("click", function(e) {
                toggleComments(e, postId);
            });
        }
    });
    return buttonArr;
}

function removeButtonListeners() {
    const main = document.querySelector("main");
    const buttonArr = main.querySelectorAll("button");
    if (buttonArr.length === 0)
        return null;
    buttonArr.forEach((button) => {
        const postId = button.dataset.id;
        if (postId) {
            button.removeEventListener("click", function(e) {
                toggleComments(e, postId);
            });
        }
    });
    return buttonArr;
}

function createComments(data) {
    const fragmentElem = document.createDocumentFragment();
    data.forEach((comment) => {
        const articleElem = document.createElement("article");
        const h3Elem = document.createElemWithText("h3", comment.name);
        const pBodyElem = document.createElemWithText("p", comment.body);
        const pEmailElem = document.createElemWithText("p", `From: ${comment.email}`);
        articleElem.append(h3Elem);
        articleElem.append(pBodyElem);
        articleElem.append(pEmailElem);
        fragmentElem.append(articleElem);
    })
    return fragmentElem;
}

function populateSelectMenu(data) {
    const selectMenu = document.getElementById("selectMenu")
    const optionArr = createSelectOptions(data);
    optionArr.forEach((option) => {
        selectMenu.append(option);
    })
    return selectMenu;
}

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const jsonUserData = await response.json();
        return jsonUserData;
    }
    catch {
        return undefined;
    }
}

async function getUserPosts(userId) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const jsonPostData = await response.json();
        const posts = jsonPostData.filter((post) => {
            if (post.id === userId)
                return post;
        });
        return posts;
    }
    catch {
        return undefined;
    }
}

async function getUser(userId) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const jsonUserData = await response.json();
        const user = jsonUserData.find((user) => {
            if (user.id === userId)
                return user;
        })
        return user;
    }
    catch {
        return undefined;
    }
}

async function getPostComments(postId) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments');
        const jsonCommentData = await response.json();
        const comments = jsonCommentData.filter((comment) => {
            if (comment.postId === postId)
                return comment;
        })
        return comments;
    }
    catch {
        return undefined;
    }
}

function toggleComments() {
    return;
}