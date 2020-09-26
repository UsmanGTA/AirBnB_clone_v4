// Check if the HTML/CSS has been loaded
$(document).ready(() => {
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
  });
});
