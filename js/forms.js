/* forms.js - form validation and the enquiry quote */

/* shows (or clears) the error message under a field */
function showError(field, message) {
    document.getElementById(field.id + '-error').textContent = message;
    field.classList.toggle('invalid', message !== '');
    field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
}

/* Runs every rule. Returns true only if all the fields are valid */
function checkRules(form, rules) {
    var firstBad = null;
    Object.keys(rules).forEach(function (id) {
        var field = form.elements[id];
        var result = rules[id](field.value);
        var message = (result ===true) ? '' : result;
        showError(field,message);
        if (message !== '' && firstBad === null) { firstBad = field; }
    });
    if (firstBad) { firstBad.focus(); }
return firstBad === null;
}

/* Checks a field as soon as the visitor leaves it */
function liveCheck(form, rules) {
    Object.keys(rules).forEach(function (id){
        var field = form.elements[id];
        field.addEventListener('blur', function() {
            var result = rules[id](field.value);
            showError(field, (result === true) ? '' : result);
        });
    });
}
/* Rules used by both forms: each returns true, or an error message */
var RULES = {
    fullname: function (v) {
        return /^[\p{L}][\p{L}\s'.-]+$/u.test(v.trim()) || 'Please enter your full name (letters only, at least 2 character).';
    },
    email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address,for example name@example.com.';

    },
    phone: function (v) {
        return /^(\+27|0)[1-9][0-9]{8}$/.test(v.replace(/[\s-]/g, '')) ||
        'Enter a South African number, for example 082 123 4567 or +27 82 123 4567.';
    }
};

/* Enquiry form (enquiry.html) */
var enquiryForm = document.getElementById('enquiry-form');

if (enquiryForm) {
    var tourSelect = enquiryForm.elements.tour;

    /* Fill the dropdown from the TOURS list in tours.js */
    TOURS.forEach(function (t) {
        var option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.name + ' (R' + t.price + ' per person)';
        tourSelect.appendChild(option);
    });

    /* If the visitor clicked "Book this tour", choose that tour automatically */
    var chosen = new URLSearchParams(window.location.search).get('tour');
    if (chosen && TOURS.some(function (t) {return t.id === chosen; })) {
        tourSelect.value = chosen;
    }

    /* This is the date picker */
    enquiryForm.elements.date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

    /*Validation rules for this form */
    var enquiryRules = {
        fullname: RULES.fullname,
        email: RULES.email,
        phone: RULES.phone,
        tour: function (v) { return v !== '' || 'Please choose a tour.'; },
        date: function (v) {
            if (v === '') { return 'Please choose a travel date.'; }
            var picked = new Date(v + 'T00:00:00');
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            return picked >= today || 'Please choose today or a future date.';
        },
        travellers: function (v) {
            var n = Number(v);
            return (Number.isInteger(n) && n >= 1 && n <=20) || 'Enter a whole number of travellers from 1 to 20.';
        },
        notes: function (v) { return v.length <= 300 || 'Special requests must be 300 characters or fewer.'; }
    };
    liveCheck(enquiryForm, enquiryRules);

    /* When the form is submitted: validate, then work out the quote */
    enquiryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!checkRules(enquiryForm, enquiryRules)) {return; }

        var f = enquiryForm.elements;
        var tour = TOURS.find(function (t) { return t.id === f.tour.value; });
        var people = Number(f.travellers.value);

        /*Build the price, one line at a time */
        var total = tour.price * people;
        var lines = [tour.name + ': ' + people + ' x R' + tour.price + ' =R' + total];
        if (people >= 6) {
            var discount = total * 0.1;
            total -= discount;
            lines.push('Group discount (10%): -R' + discount.toFixed(2));
        }
        if (f.lunch.checked) {total += 90 * people; lines.push ('Lunch pack:' + people + ' x R90 = R' + (90 * people ));}
        if (f.photos.checked) { total += 250; lines.push('Photo package: R250'); }
        if (f.pickup.value === 'hotel') { total +=100; lines.push('Hotel pick-up: R100'); }

        /* Availability of tours */

        var day = new Date(f.date.value + 'T00:00:00').getDay();
        var available = (tour.closed || []).indexOf(day) === -1;

        /* Show the response */
        var box = document.getElementById('enquiry-response');
        box.replaceChildren();

        var heading = document.createElement('h3');
        heading.textContent = 'Thank you, ' + f.fullname.value.trim().split(' ')[0] + '!';
        box.appendChild(heading);

        var intro = document.createElement('p');
        intro.textContent = 'Your quote for ' + f.date.value + ':';
        box.appendChild(intro);

        var list = document.createElement('ul');
        lines.forEach(function (text) {
            var li = document.createElement('li');
            li.textContent = text;
            list.appendChild(li);
        });
        box.appendChild(list);

        var totalLine = document.createElement('p');
        totalLine.className = 'meta';
        totalLine.textContent = 'Total: R' + total.toFixed(2);
        box.appendChild(totalLine);

        var status = document.createElement('p');
        if (available) {
            status.textContent = 'Good news: this tour is available on your chosen date. We will email ' + f.email.value.trim() + ' within 24 hours to confirm.';

        }else {
            status.textContent = 'Sorry, ' + tour.name + ' does not run on Mondays. Please choose another date.';
        }
        box.appendChild(status);

        box.hidden = false;
    });
}
/* Contact form (Contact.html) */
var EMAIL_TO = 'info@capeventures.co.za'; /* the email that the message will be sent to*/
var contactForm = document.getElementById('contact-form');

if (contactForm) {
    /*Validation rules for the for*/
    var contactRules = {
        fullname: RULES.fullname,
        email: RULES.email,
        phone: function (v) {return v.trim() === '' || RULES.phone(v); }, /*optional but must be valid if filled in */
        type: function (v) { return v !== '' || 'Please choose the type of message.'; },
        message: function (v) {
            var len = v.trim().length;
            return (len >= 10 && len <= 500) || 'Your message must be between 10 and 500 characters.';
        }
    };
    liveCheck(contactForm, contactRules);

    /* When the form is submitted: validate then build the email */
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!checkRules(contactForm, contactRules)) { return; }

            var f = contactForm.elements;
            var subject = '[' + f.type.value + '] Message from ' + f.fullname.value.trim();
            var body = 'Name: ' + f.fullname.value.trim() + '\n' +
            'Email: ' + f.email.value.trim() + '\n' +
            'Phone: ' + (f.phone.value.trim() || 'not given') + '\n' +

            'Type: ' + f.type.value + '\n\n' +
            'Message:\n' + f.message.value.trim();
            
            /* A mailito link opens the visitor's email app with everything filled in */

            var url = 'mailito:' + EMAIL_TO + '?subject=' +
            encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

            var box = document.getElementById('contact-response');
            box.replaceChildren();

            var note = document.createElement('p');
            note.textContent = 'Your email is ready. If your email app did not open, press the button below to send it to ' + EMAIL_TO + '.';
            box.appendChild(note);

            var link = document.createElement('a');
            link.className = 'map-btn';
            link.href = url;
            link.textContent = 'Open my email';
            box.appendChild(link);

            box.hidden = false;
            window.location.href = url;
    });
}