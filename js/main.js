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

    const newElem = document.createElement(this.stringName);
    newElem.textContent = this.textContent;
    if (this.className !== "")
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

async function displayComments(postId) {
    const sectionElem = document.createElement("section");
    sectionElem.dataset.postId;
    sectionElem.classList.add("comments");
    sectionElem.classList.add("hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    sectionElem.append(fragment)
}

async function createPosts(data) {
    const fragmentElem = document.createDocumentFragment();
    data.forEach(async (post) => {
        const articleElem = document.createElement("article");
        const h2Elem = post.title;
        const pElemPostBody = post.body;
        const pElemPostId = `Post ID: ${post.id}`;
        const author = await getUser(post.userId);
        const pElemAuthor = `Author: ${author.name} with ${author.company.name}`;
        const pElemCompanyPhrase = author.company.catchPhrase;
        const button = document.createElement("button");
        button.textContent("Show Comments");
        button.dataset.postId = post.id;
        articleElem.append(h2Elem);
        articleElem.append(pElemPostBody);
        articleElem.append(pElemPostId);
        articleElem.append(pElemAuthor);
        articleElem.append(pElemCompanyPhrase);
        articleElem.append(button);
        const section = await displayComments(post.id);
        articleElem.append(section);
        fragmentElem.append(articleElem);
    });
    return fragmentElem;
}

async function displayPosts(data) {
    const mainElem = document.querySelector("main");
    let element;
    if (data)
        element = await createPosts(data);
    else{
        element = document.createElement("p");
        element.textContent = "Select an Employee to display their posts.";
    }
    mainElem.append(element);
    return element;

}

function toggleComments(event, postId) {
    event.target.listener = true;
    const arr = [];
    arr.append(toggleCommentSection(postId));
    arr.append(toggleCommentButton(postId));
    return arr;
}

async function refreshPosts(data) {
    const arr = [];
    arr.append(removeButtonListeners());
    arr.append(deleteChildElements(document.querySelector("main")));
    arr.append(await displayPosts(data));
    arr.append(addButtonListeners());
    return arr;
}

async function selectMenuChangeEventHandler(event) {
    const arr = [];
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.disabled = true;
    const userId = event.target.value || 1;
    arr.append(userId);
    const userPosts = await getUserPosts(userId);
    arr.append(userPosts);
    arr.append(await refreshPosts(userPosts));
    selectMenu.disabled = false;
    return arr;
}

async function initPage() {
    const arr = [];
    const users = await getUsers();
    arr.append(users);
    arr.append(populateSelectMenu(users));
    return arr;
}

async function initApp() {
    await initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler(event));
}

document.addEventListener("DOMContentLoaded", initApp());