const R = require('ramda')
const fetch = require('node-fetch')

const URL_USERS = 'https://jsonplaceholder.typicode.com/users'
const URL_POSTS = 'https://jsonplaceholder.typicode.com/posts'


const get = url => fetch(url).then(r => r.json());
Promise.all([get(URL_USERS), get(URL_POSTS)]).then(([ users, posts ]) => {
    //ICI accès utilisateur et posts
    // console.log(users
    //     .map(d => ({nom_utilisateur: d.username, ville: d.address.city, nom_compagnie: d.company.name})
    // ));

    const trouverTitrePost = id => posts
        .find(d => d.userId === id)
        

    const resultat = users
        .map(d => ({nom_utilisateur: d.username, 
                    ville: d.address.city, 
                    nom_compagnie: d.company.name,
                    titres_posts: (trouverTitrePost(d.id)).title
                }))

    console.log(resultat);

})


// get(URL_USERS).then(console.log);









//SOLUTION A MIKAEL
// Promise.all([get(URL_USERS), get(URL_POSTS)]).then(([ users, posts ]) => {
//     users.forEach(user => {
        
//         console.log({
//             "nom_utilisateur": R.path(['username'], user),
//             "ville": R.path(['address', 'city'], user),
//             "nom_compagnie": R.path(['company', 'name'], user),
//             "titres_posts": getPostsTitles(user, posts)
//         })
//     });
// })

// function getPostsTitles (user, posts){
//     var titles = []
//     const id= R.path(['id'], user)

//     posts.find((post) => {
//         if(R.path(["userId"],post) == id) {
//             titles.push(R.path(["title"],post))
//         }
//     })
//     return titles
// }

// function getCompanyName (obj){
//     return R.path(['company', 'name'], obj)
// }









// const resultat = URL_USERS
//     .map(d => ({nom_utilisateur: d.username, ville: d.address.city, nom_companie: d.company.name}));

// console.log(resultat);