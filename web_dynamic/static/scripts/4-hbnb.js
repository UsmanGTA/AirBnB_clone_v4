// Check if the HTML/CSS has been loaded
$(document).ready(() => {
  let global_amenities = {};

  // Check the API status and return status
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', json => {
    if (json.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Check if the input checkbox has been checked
  $('input').click(() => {
    const ids = {}; // Reset the list of checked boxes with every click
    const temp = $('input:checked');
    let checkedBoxes = $('input:checked');

    for (let index = 0; index < temp.length; index++) {
      ids[checkedBoxes.attr('data-id')] = checkedBoxes.attr('data-name'); // Append {id : name}
      checkedBoxes = checkedBoxes.slice(1); // Remove the first element in the list since attr() pulls the first occurrence
    }

    // Update and add selected boxes into the search box
    // If ids{} has stuff in it, print it on the main, else reset if all the boxes are unchecked
    const amenities = Object.values(ids);
    if (amenities.length !== 0) {
      $('.amenities h4').text(amenities.join(', '));
    } else {
      $('.amenities h4').text('');
    }
    global_amenities = ids;
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'post',
    data: '{}',
    headers: { 'Content-Type': 'application/json' }
  }).done((json) => {
    for (const place of json) {
      // Generate the HTML to be appended under the .places section
      const object = `
      <article>
    	  <div class="title_box">
    	    <h2>${place.name}</h2>
    	    <div class="price_by_night">$${place.price_by_night}</div>
    	  </div>
    	  <div class="information">
          <div class="max_guest">${place.max_guest} Guest${singularPlural(place.max_guest)}</div>
          <div class="number_rooms">${place.number_rooms} Bedroom${singularPlural(place.number_rooms)}</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${singularPlural(place.number_bathrooms)}</div>
    	  </div>
        <div class="description">${place.description}</div>
    	</article>`;

      // Append the HTML generated above to the .places section
      $('.places').append(object);
    }

    /**
   * singularPlural - This function decides whether or
   * not it should append an s at the end of a string
   * to be grammatically correct
   * @number: input number
   * Return: 's' || empty_string
   */
    function singularPlural (number) {
      if (number !== 1) { return 's'; } else { return ''; }
    }

    $('button').click(() => {
      const post_data = JSON.stringify({ amenities: Object.keys(global_amenities) });
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'post',
        data: post_data,
        headers: { 'Content-Type': 'application/json' }
      }).done((json) => {
        console.log(post_data);
        $('article').remove();
        for (const place of json) {
        // Generate the HTML to be appended under the .places section
          const object = `
        <article>
      	  <div class="title_box">
      	    <h2>${place.name}</h2>
      	    <div class="price_by_night">$${place.price_by_night}</div>
      	  </div>
      	  <div class="information">
            <div class="max_guest">${place.max_guest} Guest${singularPlural(place.max_guest)}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${singularPlural(place.number_rooms)}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${singularPlural(place.number_bathrooms)}</div>
      	  </div>
          <div class="description">${place.description}</div>
      	</article>`;

          // Append the HTML generated above to the .places section
          $('.places').append(object);
        }
      });
    });
  });
});
