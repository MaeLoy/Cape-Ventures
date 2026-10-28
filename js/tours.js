/* tours.js - tour data, dynamic tour cards, search and sort */

/*The tour data (price is in rands per person; w represents the width of the big picture) */

var TOURS = [
    { id: 'table-mountain', name: 'Table Mountain Venture', price: 450, hours: 4, img: 'table-mountain-views', w: 534,
        alt: 'Table Mountain viewed from below',
        desc: "Explore one of Cape Town's most famous attractions and enjoy spectacular views of the city and surrounding areas."
    },
    { id: 'cape-point' , name: 'Cape Point Venture' , price: 750, hours: 8, img: 'cape-point-coastline-tour' , w: 1500,
        alt: 'Scenic coastline at Cape Point',
        desc: 'Discover the scenic landscape and natural beauty of Cape Point.'
    },
    { id: 'robben-island' , name: 'Robben Island Venture' , price: 650, hours: 5, img: 'robben-island-historic-site-tour' , w: 1123,
        closed: [1], /*days the the tour does not run (0=Sunday, 1= Monday etc)*/
        alt: 'Robben Island historic site',
        desc: 'Learn about the history of Robben Island and its significance in South African history.'
    },
    { id: 'penguin' , name: 'Penguin Venture' , price: 550, hours: 3, img: 'boulders-beach-african-penguins' , w: 1900,
        alt: 'African penguins at Boulders Beach',
        desc: 'Visit Boulders Beach and experience the famous African penguins.'
    } 
];

var grid = document.getElementById('tour-grid');

/* will only run on the page that has the tour grid */
if (grid) {
    var search = document.getElementById('tour-search');
    var sort = document.getElementById('tour-sort');
    var count = document.getElementById('tour-count');

/* Builds on tour card with createElement (DOM manipulation) */
function makeCard(t) {
    var card = document.createElement('article');
    card.className = 'card';

    var title = document.createElement('h3');
    title.textContent = t.name;

    var pic = document.createElement('img');
    pic.src = 'images/' + t.img + '.jpg';
    pic.srcset = 'images/' + t.img + '-480.jpg 480w, images/' + t.img + '.jpg ' + t.w + 'w';
    pic.sizes = '(max-width: 600px) 100vw, 50vw';
    pic.alt = t.alt;
    pic.loading = 'lazy'; /*Speed*/

    var desc = document.createElement('p');
    desc.textContent = t.desc;

    var info = document.createElement('p');
    info.className = 'meta';
    info.textContent = 'R' + t.price + ' per person | ' + t.hours + ' hours';

    var book = document.createElement('a');
    book.className = 'map-btn';
    book.href = 'enquiry.html?tour=' + t.id;
    book.textContent = 'Book this tour';

    card.append(title, pic, desc, info, book);
    return card;
}
/* Filters by the search text, sorts, then redraws all the cards */
function render() {
    var q = search.value.trim().toLowerCase();
    var list = TOURS.filter(function (t) {
        return (t.name + ' ' + t.desc).toLowerCase().includes(q);
    });
    
    list.sort(function (a,b) {
        if (sort.value === 'price-asc') {return a.price - b.price; }
        if (sort.value === 'price-desc') {return b.price - a.price; }
        return a.name.localeCompare(b.name);
    });

    grid.replaceChildren();
    list.forEach(function (t) { grid.appendChild(makeCard(t)); });

    if (list.length === 0) {
        count.textContent = 'No tours match your search. Try another word, for example "island".';
    }else {
        count.textContent = 'Showing ' + list.length + ' of ' + TOURS.length + ' tours';
    }
}

/* Redraw whenever the visitor types or changes the sort option */
search.addEventListener('input', render);
sort.addEventListener('change', render);
render ();
}