        

var countries = [
    { value2: 'Andorra', data2: 'AD' },
    { value2: 'Zimbabwe', data2: 'ZZ' }
];

$(document).ready(function() {
    $("#search").autocomplete({
        serviceUrl: '/autocomplete',
        //lookup: countries,
        paramName: 'displayName',
        transformResult: function(response) {
            //alert(response);
            return {
                suggestions: $.map(JSON.parse(response), function(dataItem) {
                    return { value: dataItem.displayName, data: dataItem.objectId };
                })
            };
        },
        onSelect: function (suggestion) {
            //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
            location.replace("/other?UserId="+suggestion.data);
        }
    });
});

