const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

const addRecipe = (recipe, id) => {
    let time = recipe.created_at.toDate(); 
    let html = `<li data-id="${id}">
    <div><h4>${recipe.title}</h4></div>
    <div>${recipe.body}</div>
    <div>${time}</div>
    <div>By: ${recipe.author}</div>
    <button id="deleteButton" class="btn btn-danger btn-sm my-2">Delete</button>
    <button id="editButton" class="btn btn-outline-secondary btn-sm my-2">Edit</button>
    </li>`;

    list.innerHTML += html;
}

const deleteRecipe = (id) => {
    const recipes = document.querySelectorAll('li');
    recipes.forEach(recipe => {
        if (recipe.getAttribute('data-id') === id) {
            recipe.remove();
        }
    })
}

const updateRecipe = (id) => {
    const recipes = document.querySelectorAll('li');
    recipes.forEach(recipe => {
        if (recipe.getAttribute('data-id') === id) {
            recipe.update();
        }
    })
}

//get documents
db.collection('recipes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        console.log(doc.id);
        if (change.type === 'added') {
            addRecipe(doc.data(), doc.id);
        }
        else if (change.type === 'updated') {
            updateRecipe(doc.data());
        }
        else if (change.type === 'removed') {
            deleteRecipe(doc.id);
        }
    })
});

// add docucments

form.addEventListener('submit', e => {
    e.preventDefault();

    const now = new Date();
    const recipe = {
        title: form.recipeTitle.value,
        author: form.recipeAuthor.value,
        body: form.recipeBody.value,
        important: false,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection('recipes').add(recipe).then(() => {
        if (document.querySelector('#recipeCheck').checked == true) {
            recipe.important = true;
        }
        console.log("recipe added with importance value: " + recipe.important);
        document.querySelector('#recipeAuthor').value = "";
        document.querySelector('#recipeTitle').value = "";
        document.querySelector('#recipeBody').value = "";
    }).catch(err => {
        console.log(err);
    });
});

// editing data

list.addEventListener('click', e => {
    console.log(e);
    if (e.target.id === 'editButton') {
        const id = e.target.parentElement.getAttribute('data-id');
        /*let htmlEdit = `<div>
        <input type="text">${recipe.title}</input>
        <input type="text">${recipe.body}</input>
        <input type="text">${recipe.author}</input>
        </div>`;
        list.innerHTML += htmlEdit;*/
        db.collection('recipes').doc(id).update({
            title: "Updated title",
            body: "Updated body",
            created_at: Date.now()
        }).then(() => {
            console.log("updated")
        }).catch(err => {
            console.log(err)
        })
    }
}) //works on db-side, but not on client side


// deleting data
list.addEventListener('click', e => {
    //console.log(e);
    if (e.target.id === 'deleteButton') {
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('recipes').doc(id).delete().then(() => {
            console.log("Recipe deleted");
        });
    }
})

// search functionality
const searchBar = document.getElementById('searchBar');
let recipeSearch = [];

console.log(searchBar);
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredRecipes = recipeSearch.filter((recipe) => {
        return (
        recipe.title.toLowerCase().includes(searchString) ||
        recipe.body.toLowerCase().includes(searchString)
        );
    });
    console.log(filteredRecipes);
});


