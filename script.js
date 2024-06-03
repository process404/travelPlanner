

$(document).ready(function(){
    var travelItinerary = {
        name: "",
        description: "",
        duration: "",
        startDate: "",
        endDate: "",
        days: []
    };

    $("#startScreen").hide();
    $("#finalScreen").show();

    $("#nextButton").click(function(){
        $("#startScreen").hide();
        $("#planningScreen").show();
      

        // Store the data from the first page into the travelItinerary object
        travelItinerary.name = $("#nameField").val();
        travelItinerary.description = $("#descField").val();
        travelItinerary.startDate = $("#startDateField").val();
        travelItinerary.endDate = $("#endDateField").val();

        document.title = travelItinerary.name || "My generated trip" + (travelItinerary.startDate ? " from " + travelItinerary.startDate : "") + (travelItinerary.endDate ? " to " + travelItinerary.endDate : "");

        var startDate = new Date(travelItinerary.startDate);
        var endDate = new Date(travelItinerary.endDate);
        var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        var durationDays = Math.ceil((timeDiff / (1000 * 3600 * 24)) + 1);

        travelItinerary.duration = durationDays;

        if (durationDays < 1) {
            durationDays = 1;
        }

        $("#daysContainer").empty();

        for (var i = 0; i < durationDays; i++) {
            var dayDiv = $("<div class='day'><div style='display: flex'><h4 style='width: 100%'>Day " + (i + 1) + " </h4><button class='addButton' style='width: auto'>Add</button></div><hr><div class='travelItinerary'></div></div>");
            $("#daysContainer").append(dayDiv);
        }

        $(".addButton").click(function(){
            var id = prompt("Enter ID:");
            var departureTime = prompt("Enter departure time:");
            var arrivalTime = prompt("Enter arrival time:");

            while (!/^\d{4}$/.test(departureTime) || !/^\d{4}$/.test(arrivalTime)) {
                alert("Invalid input. Please try again.");
                departureTime = prompt("Enter departure time:");
                arrivalTime = prompt("Enter arrival time:");
            }

            var toc = prompt("Enter TOC:");
            var travelClass = prompt("Enter class:");
            var from = prompt("Enter departure location:");
            var to = prompt("Enter arrival location:");
            var note = prompt("Enter a note:");

            while (toc.length > 5 || travelClass.length > 5 || id.length > 10) {
                alert("Invalid input. Please try again.");
                id = prompt("Enter ID:");
                departureTime = prompt("Enter departure time:");
                arrivalTime = prompt("Enter arrival time:");
                toc = prompt("Enter TOC:");
                travelClass = prompt("Enter class:");
                from = prompt("Enter departure location:");
                to = prompt("Enter arrival location:");
                note = prompt("Enter a note:");
            }
        
            // Get the index of the current day div
            var dayIndex = $(this).closest('.day').index();
        
            // Check if the day already exists in the travelItinerary.days array
            if (!travelItinerary.days[dayIndex]) {
                // If the day doesn't exist, create it
                travelItinerary.days[dayIndex] = [];
            }
        
            // Add the itinerary to the correct day
            travelItinerary.days[dayIndex].push({
                id: id,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                toc: toc,
                class: travelClass,
                from: from,
                to: to,
                note: note
            });

          // Create a new div element with the itinerary information
            var itineraryItem = $("<div class='itineraryItem'>" +
            "<div class='timeBox'>" +
            "<p class='departureTime'>" + departureTime + "</p>" +
            "<p class='arrivalTime'>" + arrivalTime + "</p>" +
            "</div>" +
            "<div class='detailsBox'>" +
            "<p style='font-style:italic'>" + toc + " " + "<span>" + id + "</span>" + " " + " from " + from + " to " + to + "</p>" +
            "<p style='margin-right: 15px'>Note: " + note + "</p>" +
            "</div>" +
            "<div class='buttonBox'>" +
            "<button class='editButton'>Edit</button>" +
            "<button class='deleteButton'>Delete</button>" +
            "</div>" +
            "</div>");

            // Append the new div element to the travelItinerary div within the current day div
            $(this).closest('.day').find('.travelItinerary').append(itineraryItem);

            $(".editButton").click(function(){
                // Prompt the user to edit the information
                var id = prompt("Enter ID:", id);
                var departureTime = prompt("Enter departure time:", departureTime);
                var arrivalTime = prompt("Enter arrival time:", arrivalTime);
                var toc = prompt("Enter TOC:", toc);
                var travelClass = prompt("Enter class:", travelClass);
                var from = prompt("Enter departure location:", from);
                var to = prompt("Enter arrival location:", to);
                var note = prompt("Enter a note:", note);
            
                // Get the index of the current day div
                var dayIndex = $(this).closest('.day').index();
            
                // Get the index of the current itinerary item
                var itemIndex = $(this).closest('p').index();
            
                // Update the information in the travelItinerary.days array
                travelItinerary.days[dayIndex][itemIndex] = {
                    id: id,
                    departureTime: departureTime,
                    arrivalTime: arrivalTime,
                    toc: toc,
                    class: travelClass,
                    from: from,
                    to: to,
                    note: note
                };
            
                 // Update the information in the travelIternary div
                $(this).parent().html("<div class='timeBox'><p>" + departureTime + "</p><p>" + arrivalTime + "</p></div><div class='detailsBox'><p>" + id + " " + toc + " " + travelClass + " from " + from + " to " + to + "</p><p>Note: " + note + "</p></div><button class='editButton'>Edit</button><button class='deleteButton'>Delete</button>");
            });

            $(".deleteButton").click(function(){
                // Show a confirmation dialog
                if (!confirm("Are you sure you want to delete this item?")) {
                    return;
                }

                // Get the index of the current day div
                var dayIndex = $(this).closest('.day').index();

                // Get the index of the current itinerary item
                var itemIndex = $(this).closest('.itineraryItem').index();

                // Remove the itinerary item from the travelItinerary.days array
                travelItinerary.days[dayIndex].splice(itemIndex, 1);

                // Remove the itinerary item from the travelIternary div
                $(this).closest('.itineraryItem').remove();
            });

        });
            
    });
    $("#backButton").click(function(){
        $("#planningScreen").hide();
        $("#startScreen").show();
    });

    $('#finishButton').click(function(){

        if (!confirm("Are you sure you want to finish planning?")) {
            return;
        }

        // Set the id's for the print elements
        $("#printTitle").text(travelItinerary.name.toUpperCase() || "MY GENERATED TRIP");
        $("#printDescription").text((travelItinerary.description.toUpperCase() || "GENERATED " + new Date().toLocaleDateString()) + " " + new Date().toLocaleTimeString());
        $("#printDuration").text(travelItinerary.duration + " DAYS");
        $("#printFrom").text(travelItinerary.startDate.toUpperCase());
        $("#printTo").text(travelItinerary.endDate.toUpperCase());

        

        $("#tableSection table").remove();

        var table = $('<table>');
        table.append('<tr><th class="short">ID</th><th class="short">DEP</th><th class="short">ARR</th><th class="long">FROM</th><th class="long">TO</th><th class="short">TOC</th><th class="short">CLASS</th><th class="long">NOTE</th></tr>');
        var dayNumber = 1;
        travelItinerary.days.forEach(function(day) {
            // Add a row at the start of each day's itineraries
            var dayRow = $('<tr>').append('<td colspan="8">Day ' + dayNumber + '</td>');
            table.append(dayRow);
        
            day.forEach(function(itinerary) {
                var row = $('<tr>');
                row.append('<td class="short">' + itinerary.id + '</td>');
                row.append('<td class="short">' + itinerary.departureTime + '</td>');
                row.append('<td class="short">' + itinerary.arrivalTime + '</td>');
                row.append('<td class="long">' + itinerary.from + '</td>');
                row.append('<td class="long">' + itinerary.to + '</td>');
                row.append('<td class="short">' + itinerary.toc + '</td>');
                // row.append('<td class="short">' + itinerary.class + '</td>');
                row.append('<td class="note">' + itinerary.note + '</td>');
                table.append(row);
            });
        
            dayNumber++;
        });



        $('#tableSection').append(table);

        $("#planningScreen").hide();
        $("#finalScreen").show();





        console.log(travelItinerary);
    });

    $('#backToPlanningButton').click(function(){
        $("#finalScreen").hide();
        $("#planningScreen").show();
    });

    $('#printButton').click(function(){
        document.title = travelItinerary.name || "My generated trip" + (travelItinerary.startDate ? " from " + travelItinerary.startDate : "") + (travelItinerary.endDate ? " to " + travelItinerary.endDate : "");
        $('#printNavigationButtons').addClass('hidden');
        
        // Delay the print command
        setTimeout(function() {
            window.print();
            // After printing, show the buttons again
            $('#printNavigationButtons').removeClass('hidden');
        }, 0);
    });

    $('#loadButton').click(function(){
        var data = prompt("Enter the JSON data:");
        try {
            travelItinerary = JSON.parse(data);
            // switch to planning screen
            $("#startScreen").hide();
            $("#planningScreen").show();
            // Set the values of the fields
            $("#nameField").val(travelItinerary.name);
            $("#descField").val(travelItinerary.description);
            $("#startDateField").val(travelItinerary.startDate);
            $("#endDateField").val(travelItinerary.endDate);

            
        } catch (e) {
            alert("Invalid JSON data.");
        }
    });

    $('#saveToJson').click(function(){
        alert("Copy the JSON data coming next");
        var data = JSON.stringify(travelItinerary);
        alert(data);

    });
});
