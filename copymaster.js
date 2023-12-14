const tabsContainer = document.querySelector("#tabs");
const contentElement = document.querySelector("#content");
const tabRows = [];



// Search
const searchBox = document.createElement('input');
searchBox.id = 'search-box';
searchBox.placeholder = "Search...";
searchBox.addEventListener('input', () => {
    // search function
});
document.body.insertBefore(searchBox, document.body.firstChild);

// Dark mode
const darkModeToggle = document.createElement('button');
darkModeToggle.id = 'dark-mode-toggle';
darkModeToggle.textContent = "Dark Mode";
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? "Light Mode" : "Dark Mode";
});
document.body.insertBefore(darkModeToggle, document.body.firstChild);
// 1

function createTabs(data, level) {
    // Remove all tabs below this level
    while (tabRows.length > level) {
        const lastRow = tabRows.pop();
        lastRow.remove();
    }

    const tabRow = document.createElement('div');
    tabRow.classList.add('tab-row');
    tabRows.push(tabRow);
    tabsContainer.appendChild(tabRow);

    let firstTabElement = null;

    Object.keys(data).forEach(tabName => {
        const tabData = data[tabName];
        const tabElement = document.createElement('button');
        tabElement.textContent = tabName;
        tabElement.addEventListener('click', () => {
            while (contentElement.firstChild) {
                contentElement.firstChild.remove();
            }
            // Highlight selected tab
            Array.from(tabRow.children).forEach(child => {
                child.classList.remove('selected-tab');
            });
            tabElement.classList.add('selected-tab');

            if (Array.isArray(tabData)) {
                var test = document.createElement('h3');
                test.innerHTML=tabName
                console.log(test);
                contentElement.appendChild(test);
                tabData.forEach(createItem);
            }
            else {
                createTabs(tabData, level + 1);
            }
        });
        tabRow.appendChild(tabElement);

        if (firstTabElement === null) {
            firstTabElement = tabElement
        }
    });
    if (firstTabElement) {
        firstTabElement.click();
    }
}

function createItem(itemData) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('item-container');

    var bold = itemData.Bold;

    if (itemData.Button) {
        const button = document.createElement('button');
        button.textContent = itemData.Title;
        button.title = itemData.Content;
        button.classList.add('item-button-content');
        button.onclick = () => navigator.clipboard.writeText(itemData.Content);

        button.addEventListener('click', function () {
            showNotification(`${itemData.Content}`);
        })
        itemContainer.appendChild(button);
    }
    else if (itemData.List) {
        const ul = document.createElement('ul');
        itemData.List.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        itemContainer.appendChild(ul);
    } else if (itemData.Table) {
        const table = document.createElement('table');

        // Create table headers
        const headerRow = document.createElement('tr');
        itemData.Table.Headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create table rows
        itemData.Table.Rows.forEach(rowData => {
            const tr = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        itemContainer.appendChild(table);
    } else
    {
        if (itemData.Title)
        {
        const title = document.createElement('h3');
        title.textContent = itemData.Title;
        if (bold) {
            title.style.fontWeight="bold";
        }
        itemContainer.appendChild(title);
        }
        if (itemData.Content)
        {
        const content = document.createElement('p');
        content.textContent = itemData.Content;
        if (bold) {
            content.style.fontWeight="bold";
        }
        itemContainer.appendChild(content);
        }
    }
    contentElement.appendChild(itemContainer);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add("notification");
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 1000);
}
