(function($) {
var map = null;
var originMarkerArr = [];
var origin = {};
$(document).ready(function() {
var geocoder = new google.maps.Geocoder();
var bounds = new google.maps.LatLngBounds;
map = new google.maps.Map(document.getElementById('google-map'), {
center: {lat: -34.397, lng: 150.644},
zoom: 5
});
geocoder.geocode({'address': 'India'}, function(results, status) {
if (status === 'OK') {
map.setCenter(results[0].geometry.location);
}
});
var originIcon = 'https://chart.googleapis.com/chart?' +
'chst=d_map_pin_letter&chld=O|FFFF00|000000'
var destinationIcon = 'https://chart.googleapis.com/chart?' +
'chst=d_map_pin_letter&chld=D|FF0000|000000';
$("#from-address, #to-address").on('focus', function() {
$(this).parent().removeClass('has-error');
});
$("#from-address").on('blur', function() {
var address = $(this).val();
deleteOriginMarkers();
if (!address) {
$("#from-address").parent().addClass('has-error');
return;
}
geocoder.geocode({'address': address}, function(results, status) {
if (status === 'OK') {
map.fitBounds(bounds.extend(results[0].geometry.location));
origin['lat'] = results[0].geometry.location.lat();
origin['lng'] = results[0].geometry.location.lng();
origin['addr'] = results[0].formatted_address;
originMarkerArr.push(new google.maps.Marker({
map: map,
position: results[0].geometry.location,
icon: originIcon
}));
$("#from-address").parent().removeClass('has-error').addClass('has-success');
} else {
$("#from-address").parent().addClass('has-error');
}
});
});
var destMarkerArr = [];
var dest = {};
$("#to-address").on('blur', function() {
var address = $(this).val();
deleteDestMarkers();
if (!address) {
$("#to-address").parent().addClass('has-error');
return;
}
geocoder.geocode({'address': address}, function(results, status) {
if (status === 'OK') {
map.fitBounds(bounds.extend(results[0].geometry.location));
dest['lat'] = results[0].geometry.location.lat();
dest['lng'] = results[0].geometry.location.lng();
dest['addr'] = results[0].formatted_address;
destMarkerArr.push(new google.maps.Marker({
map: map,
position: results[0].geometry.location,
icon: destinationIcon
}));
$("#to-address").parent().removeClass('has-error').addClass('has-success');
} else {
$("#to-address").parent().addClass('has-error');
}
});
});
var service = new google.maps.DistanceMatrixService;
$("#twitter-post").on('click', function(e) {
distance = 0;
orLat = origin.lat;
orLng = origin.lng;
orAddr = origin.addr;
originArr = [{lat: orLat, lng:orLng}, orAddr];
deLat = dest.lat;
deLng = dest.lng;
deAddr = dest.addr;
destArr = [{lat: deLat, lng:deLng}, deAddr];
service.getDistanceMatrix({
origins: originArr,
destinations: destArr,
travelMode: 'DRIVING',
unitSystem: google.maps.UnitSystem.METRIC,
avoidHighways: false,
avoidTolls: false
}, function(response, status) {
if (status == 'OK') {
for (var i in response.rows) {
distance = response.rows[i].elements[0].distance.value;
}
distance = distance/1000;
d = "Distance between " + orAddr+ " and " + deAddr + " is " + distance.toString() + " kms"
var twtLink = 'http://twitter.com/home?status=' +encodeURIComponent(d);
//alert(twtLink);
window.location = twtLink;
}
});
});
function deleteDestMarkers() {
for (var i = 0; i < destMarkerArr.length; i++) {
destMarkerArr[i].setMap(null);
}
destMarkerArr = [];
}
function deleteOriginMarkers() {
for (var i = 0; i < originMarkerArr.length; i++) {
originMarkerArr[i].setMap(null);
}
originMarkerArr = [];
}
});
})(jQuery);