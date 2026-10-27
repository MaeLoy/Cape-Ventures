/*This finds every question button and when l click on it then it will check if the answer is open, flips it then hides or shows the matching answer box*/
document.querySelectorAll('.acc-btn').forEach(function (btn){
    btn.addEventListener('click' , function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        document.getElementById(btn.getAttribute('aria-controls')).hidden =
        isOpen;
    });
}) ;

/* Gallery lightbox: opens a larger version of the clicked picture */

var lb = document.getElementById('lightbox');
if (lb) {
    var links = Array.from(document.querySelectorAll('.gallery a'));
    var current = 0;
    var bigImg = lb.querySelector('img');
    var caption = lb.querySelector('figcaption');
/*This shows the picture number*/
function show(n) {
    current= (n + links.length) % links.length;
    var thumb = links[current].querySelector('img');
    bigImg.src = links[current].href;
    bigImg.alt = thumb.alt;
    caption.textContent = thumb.alt;
}

/* Clicking thumbnail opens the lightbox instead of leaving the page */

links.forEach(function (a, n) {
    a.addEventListener('click', function (e){
        e.preventDefault();
        show(n);
        lb.showModal();
    });
}) ;
lb.querySelector('.prev').addEventListener('click', function (){show(current-1); });

lb.querySelector('.next').addEventListener('click', function (){show(current+1); });

lb.querySelector('.close').addEventListener('click', function (){ lb.close(); });

}
document.documentElement.classList.add('js'); /* communicates with CSS that JavaScript is working */

var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry){
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); /* Stop watching once it appears */
        }
    });
}, {threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function (el){
    observer.observe(el);
});