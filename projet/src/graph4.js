//COMPTEUR de but (un for each au cas ou pour finir je voudrais en mettre d'autres)
const data = require('../data/graph4/data-graph4.json');
const counters = document.querySelectorAll('.counter');
const speed = 100; // The lower the slower

//ajoute de la bonne valeur dans l'attribut dans le html
const dataTarget = document.querySelector('.counter');
const TheTarget = data;
dataTarget.setAttribute("data-target", TheTarget);


//Le compteur en lui même
counters.forEach(counter => {
	const updateCount = () => {
		const target = +counter.getAttribute('data-target'); //attribut dans le html directement
		const count = +counter.innerText;

		// variation de la vitesse d'incrémentation
		const inc = target / speed;

		// console.log(inc);
		// console.log(count);

		// Vérifie si la cible est atteinte
		if (count < target) {
			// Ajoute l'incrémentation au compteur
			counter.innerText = Math.round(count + inc);
			// Appel la fonction toutes les x ms
			setTimeout(updateCount, 50);
		} else {
			counter.innerText = target;
		}
	};

	updateCount();
});
