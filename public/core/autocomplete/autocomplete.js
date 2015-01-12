        

var countries = [
    { value: 'Andorra', data: 'AD' },
    { value: 'Zimbabwe', data: 'ZZ' }
];

$(document).ready(function() {
    $("#search").autocomplete({
        lookup: countries,
        onSelect: function (suggestion) {
            alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });
});

