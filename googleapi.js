//AIzaSyDgygXLsCRV5062t7x0WH9j2rz_ducnjWo

//caphill: 47.615366, -122.320783
//otc: 47.644444, -122.133286
//middle: 47.610693, -122.243152
otc_coord = { lat: 47.644444, lng: -122.133286 };
caphill_coord = { lat: 47.615366, lng: -122.320783 };


global_origin = null;

function initMap() {

    // var searchBar = ;

    // let autocomplete = new google.maps.places.Autocomplete($("#searchbar"));

    // autocomplete.bindTo('bounds', map);

    var seattleBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(47.555513, -122.404557),
        new google.maps.LatLng(47.717914, -122.068787)
    );

    var directionsDisplayCH = new google.maps.DirectionsRenderer;
    var directionsDisplayOTC = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;

    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(
            document.getElementById('searchbar')), {
            bounds: seattleBounds,
            componentRestrictions: { country: "us" }
        });

    
    var midmap = { lat: 47.610693, lng: -122.243152 };
    var mapCH = new google.maps.Map(document.getElementById('map-ch'), {
        zoom: 12,
        center: midmap
    });
    
    var mapOTC = new google.maps.Map(document.getElementById('map-otc'), {
        zoom: 12,
        center: midmap
    });
    
    var caphill = new google.maps.Marker({
        position: caphill_coord,
        map: mapCH,
        label: "CH",
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    var otc = new google.maps.Marker({
        position: otc_coord,
        map: mapOTC,
        label: "OTC"
    });

    directionsDisplayCH.setMap(mapCH);
    directionsDisplayOTC.setMap(mapOTC);

    $("#searchbutton").click(function(){
        calculateAndDisplayRoute(directionsService, directionsDisplayCH, caphill_coord, "#ch-time");
        calculateAndDisplayRoute(directionsService, directionsDisplayOTC, otc_coord, "#otc-time");
    });

    $('#searchbar').keypress(function (e) {
        if (e.which == 13) {
            calculateAndDisplayRoute(directionsService, directionsDisplayCH, caphill_coord, "#ch-time");
            calculateAndDisplayRoute(directionsService, directionsDisplayOTC, otc_coord, "#otc-time"); 
            return false; //<---- Add this line
        }
      });

    //   $('#searchbar').change(function () {
        
    //         calculateAndDisplayRoute(directionsService, directionsDisplayCH, caphill_coord, "#ch-time");
    //         calculateAndDisplayRoute(directionsService, directionsDisplayOTC, otc_coord, "#otc-time"); 
    //         return false; //<---- Add this line
        
    //   });

    //calculateAndDisplayRoute(directionsService, directionsDisplay);
}




function calculateAndDisplayRoute(directionsService, directionsDisplay, destination, time) {
    var searchOrigin = $("#searchbar")[0].value;
    var encodedOrigin = encodeURI(searchOrigin);
    //console.log(searchOrigin);
    
    var nextTime = new Date();
    if(nextTime.getHours() > 9){
        nextTime.setDate(nextTime.getDate() + 1)
    }
    nextTime.setHours(9,0,0,0);

    // console.log(nextTime);

    directionsService.route({
        origin: searchOrigin,
        destination: destination,
        travelMode: google.maps.TravelMode["TRANSIT"],
        transitOptions:{
            arrivalTime: nextTime
        }
    },
        function (response, status) {
            var duration = 0;
            response.routes[0].legs.forEach(function(x){
                duration += x.duration.value;
            })
            // console.log(duration);
            $(time).text(Math.floor(duration/60).toString() + " minutes");
            // console.log(response.routes[0].legs);
            if (status == "OK") {
                directionsDisplay.setDirections(response);
            } else {
                window.alert(status);
            }
        }
    );

    
}

