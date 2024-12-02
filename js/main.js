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
    if (!(parentElement instanceof HTMLElement))
        return undefined;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners() {
    const main = document.querySelector("main");
    const buttonArr = main.querySelectorAll("button");
    if (buttonArr === null)
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
    if (buttonArr.length === null)
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
    if (!data)
        return undefined;
    const fragmentElem = document.createDocumentFragment();
    data.forEach((comment) => {
        const articleElem = document.createElement("article");
        const h3Elem = createElemWithText("h3", comment.name, "");
        const pBodyElem = createElemWithText("p", comment.body, "");
        const pEmailElem = createElemWithText("p", `From: ${comment.email}`, "");
        articleElem.append(h3Elem);
        articleElem.append(pBodyElem);
        articleElem.append(pEmailElem);
        fragmentElem.append(articleElem);
    })
    return fragmentElem;
}

function populateSelectMenu(data) {
    if (!data)
        return undefined;
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
    if (!userId)
        return undefined;
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const jsonPostData = await response.json();
        const posts = jsonPostData.filter((post) => {
            if (post.userId === userId)
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
    if (!postId)
        return undefined;
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
    if (!postId)
        return undefined;
    const sectionElem = document.createElement("section");
    sectionElem.dataset.postId = postId;
    sectionElem.classList.add("comments");
    sectionElem.classList.add("hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    sectionElem.append(fragment)
    return sectionElem;
}

async function createPosts(data) {
    if (!data)
        return undefined;
    const fragmentElem = document.createDocumentFragment();
    for (const post of data) {
        const articleElem = document.createElement("article");
        const h2Elem = document.createElement("h2");
        h2Elem.textContent = post.title;
        const pElemPostBody = document.createElement("p");
        pElemPostBody.textContent = post.body;
        const pElemPostId = document.createElement("p");
        pElemPostId.textContent = `Post ID: ${post.id}`;
        const author = await getUser(post.userId);
        const pElemAuthor = document.createElement("p");
        pElemAuthor.textContent = `Author: ${author.name} with ${author.company.name}`;
        const pElemCompanyPhrase = document.createElement("p");
        pElemCompanyPhrase.textContent = author.company.catchPhrase;
        const button = document.createElement("button");
        button.textContent = "Show Comments";
        button.dataset.postId = post.id;
        const section = await displayComments(post.id);
        articleElem.append(h2Elem, pElemPostBody, pElemPostId, pElemAuthor, pElemCompanyPhrase, button, section);
        fragmentElem.append(articleElem);
    }
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
        element.classList.add("default-text");
    }
    mainElem.append(element);
    return element;

}

function toggleComments(event, postId) {
    if (!event && !postId)
        return undefined;
    event.target.listener = true;
    const arr = [];
    arr.push(toggleCommentSection(postId));
    arr.push(toggleCommentButton(postId));
    return arr;
}

async function refreshPosts(data) {
    if (!data)
        return undefined;
    const arr = [];
    arr.push(removeButtonListeners());
    arr.push(deleteChildElements(document.querySelector("main")));
    arr.push(await displayPosts(data));
    arr.push(addButtonListeners());
    return arr;
}

async function selectMenuChangeEventHandler(event) {
    if (!event?.target)
        return undefined;
    const userId = event.target.value || 1;
    event.target.disabled = true;
    let arr = [];
    const postsArr = await getUserPosts(userId);
    const refreshPostsArr = await refreshPosts(postsArr);
    arr.push(userId, postsArr, refreshPostsArr);
    event.target.disabled = false;
    return arr;
}

async function initPage() {
    const arr = [];
    const users = await getUsers();
    arr.push(users);
    arr.push(populateSelectMenu(users));
    return arr;
}

async function initApp() {
    await initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);