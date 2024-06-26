﻿const uri = 'api/TodoItems';
let todos = [];

function getItems() {
    fetch(uri, {    

    //}).then(response => {
    //    if (response.ok) { console.log("HTTP request successful") }
    //    else { console.log("HTTP request unsucessful") }
    //    return response
    }).then(response => response.json())
      .then(data => _displayItems(data))
      .catch(error => console.error('unable to delete item', error));    
}


function addItem() {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    }).then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = "";
        }).catch(error => console.error('Unable to Add item', error));  
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    }).then(() => getItems())
      .catch(error => console.error('Unable to delete item.', error));    
}


function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemid = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemid, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${itemid}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(item) 
    })
      .then(() => getItems())
      .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false; 
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(ItemCount) {
    const name = (ItemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${ItemCount} ${name}`;
}  

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = "";

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = "checkbox";
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = "Edit";
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);

        let td5 = tr.insertCell(4);
        textNode = document.createTextNode(item.id);
        td5.appendChild(textNode);
    });

    todos = data;
}