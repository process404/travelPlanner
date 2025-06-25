$(document).ready(function(){
    var travelItinerary = {
        name: "",
        description: "",
        duration: "",
        startDate: "",
        endDate: "",
        days: []
    };

    if (localStorage.getItem("travelItinerary")) {
        travelItinerary = JSON.parse(localStorage.getItem("travelItinerary"));
        $("#nameField").val(travelItinerary.name);
        $("#descField").val(travelItinerary.description);
        $("#startDateField").val(travelItinerary.startDate);
        $("#endDateField").val(travelItinerary.endDate);
        nextButton();
    }

    function sortJourneysByStartTime() {
        for (var i = 0; i < travelItinerary.days.length; i++) {
            if (Array.isArray(travelItinerary.days[i])) {
                // Filter out nulls
                travelItinerary.days[i] = travelItinerary.days[i].filter(item => item !== null);

                travelItinerary.days[i].sort(function(a, b) {
                    if (a && b && a.departureTime && b.departureTime) {
                        var aTime = a.departureTime.replace(":", "");
                        var bTime = b.departureTime.replace(":", "");
                        if (aTime === bTime) {
                            return a.id.localeCompare(b.id);
                        }
                        return aTime.localeCompare(bTime);
                    } else {
                        console.error("Invalid itinerary item (during sort):", a, b);
                        return 0;
                    }
                });
            }
        }
    }




    function startNewButton(){
        travelItinerary = {
            name: "",
            description: "",
            duration: "",
            startDate: "",
            endDate: "",
            days: []
        }

        $("#nameField").val(travelItinerary.name);
        $("#descField").val(travelItinerary.description);
        $("#startDateField").val(travelItinerary.startDate);
        $("#endDateField").val(travelItinerary.endDate);

        localStorage.clear();

        $("#planningScreen").hide();
        $("#startScreen").show();
    }
    

    function nextButton(){
        $("#startScreen").hide();
        $("#planningScreen").show();

        sortJourneysByStartTime();
        updateUI();
    

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

        var durationDays = travelItinerary.duration;
        for (var i = 0; i < durationDays; i++) {
            var dayDiv = $("<div class='day'><div style='display: flex'><h4 style='width: 100%'>Day " + (i + 1) + " </h4><button class='addButton' style='width: auto'>Add</button></div><hr><div class='travelItinerary'></div></div>");
            $("#daysContainer").append(dayDiv);
        }


        for (var i = 0; i < travelItinerary.days.length; i++) {
            var dayDiv = $(".day").eq(i);
            for (var j = 0; j < travelItinerary.days[i].length; j++) {
                var itinerary = travelItinerary.days[i][j];
                var itineraryItem = $("<div class='itineraryItem'>" +
                "<div class='timeBox'>" +
                "<p class='departureTime'>" + itinerary.departureTime + "</p>" +
                "<p class='arrivalTime'>" + itinerary.arrivalTime + "</p>" +
                "</div>" +
                "<div class='detailsBox'>" +
                "<p style='font-style:italic'>" + itinerary.toc + " " + "<span>" + itinerary.id + "</span>" + " " + " from " + itinerary.from + " to " + itinerary.to + "</p>" +
                "<p style='margin-right: 15px'>Note: " + itinerary.note + "</p>" +
                "</div>" +
                "<div class='buttonBox'>" +
                "<button class='editButton'>Edit</button>" +
                "<button class='deleteButton'>Delete</button>" +
                "</div>" +
                "</div>");
                $(dayDiv).find(".travelItinerary").append(itineraryItem);
            }
        }

       function editButtonHandler() {
            var itineraryItemElement = $(this).closest('.itineraryItem');
            var dayIndex = itineraryItemElement.closest('.day').index();
            var itemIndex = itineraryItemElement.index();

            var itinerary = travelItinerary.days[dayIndex][itemIndex];

            $('#formId').val(itinerary.id);
            $('#formDepartureTime').val(itinerary.departureTime);
            $('#formArrivalTime').val(itinerary.arrivalTime);
            $('#formTOC').val(itinerary.toc);
            $('#formClass').val(itinerary.class);
            $('#formFrom').val(itinerary.from);
            $('#formTo').val(itinerary.to);
            $('#formNote').val(itinerary.note);

            $('#addEditWindow').show().data('dayIndex', dayIndex).data('itemIndex', itemIndex);
        }

        $(".editButton").click(editButtonHandler);

       function updateUI() {
            $("#daysContainer").empty();

            var durationDays = travelItinerary.duration;
            for (var i = 0; i < durationDays; i++) {
                var dayDiv = $("<div class='day'><div style='display: flex'><h4 style='width: 100%'>Day " + (i + 1) + " </h4><button class='addButton' style='width: auto'>Add</button></div><hr><div class='travelItinerary'></div></div>");
                $("#daysContainer").append(dayDiv);
            }

            for (var i = 0; i < travelItinerary.days.length; i++) {
                var dayDiv = $(".day").eq(i);
                var travelItineraryDiv = dayDiv.find(".travelItinerary");

                // Clear the travel itinerary div before re-adding items
                travelItineraryDiv.empty();

                // Ensure that travelItinerary.days[i] is an array and filter out null values
                if (Array.isArray(travelItinerary.days[i])) {
                    var validItems = travelItinerary.days[i].filter(item => item !== null);

                    for (var j = 0; j < validItems.length; j++) {
                        var itinerary = validItems[j];

                        // Validate that the itinerary item exists and has the required properties
                        if (itinerary && itinerary.departureTime && itinerary.arrivalTime) {
                            var itineraryItem = $("<div class='itineraryItem'>" +
                                "<div class='timeBox'>" +
                                "<p class='departureTime'>" + itinerary.departureTime + "</p>" +
                                "<p class='arrivalTime'>" + itinerary.arrivalTime + "</p>" +
                                "</div>" +
                                "<div class='detailsBox'>" +
                                "<p style='font-style:italic'>" + itinerary.toc + " " + "<span>" + itinerary.id + "</span>" + " " + " from " + itinerary.from + " to " + itinerary.to + "</p>" +
                                "<p style='margin-right: 15px'>Note: " + itinerary.note + "</p>" +
                                "</div>" +
                                "<div class='buttonBox'>" +
                                "<button class='editButton'>Edit</button>" +
                                "<button class='deleteButton'>Delete</button>" +
                                "</div>" +
                                "</div>");
                            travelItineraryDiv.append(itineraryItem);
                        } else {
                            console.error("Invalid itinerary item:", itinerary);
                        }
                    }
                } else {
                    console.error("travelItinerary.days[i] is not an array:", travelItinerary.days[i]);
                }
            }

            $(".editButton").click(editButtonHandler);
            $(".deleteButton").click(deleteButtonHandler); 
            $('.addButton').off('click').on('click', function() {
                var dayIndex = $(this).closest('.day').index();
                $('#addEditWindow').show().data('dayIndex', dayIndex);
                $('#addEditForm')[0].reset();
            });
        }





        $(".startNewButton").click(function(){
            if (!confirm("Are you sure you want to start a new itinerary?")) {
                return;
            }
            startNewButton();
        });

        
        function deleteButtonHandler(){
            
            if (!confirm("Are you sure you want to delete this item?")) {
                return;
            }
            
            
            var dayIndex = $(this).closest('.day').index();
            
            
            var itemIndex = $(this).closest('.itineraryItem').index();
            
            
            travelItinerary.days[dayIndex].splice(itemIndex, 1);
            
            
            $(this).closest('.itineraryItem').remove();
            sortJourneysByStartTime();
            updateUI();
        };
        
        $(".editButton").click(editButtonHandler);
        $(".deleteButton").click(deleteButtonHandler);
        $('.addButton').off('click').on('click', function() {
            var dayIndex = $(this).closest('.day').index();
            $('#addEditWindow').show().data('dayIndex', dayIndex);
            $('#addEditForm')[0].reset();
        });



        
        
        
        

$('.addButton').off('click').on('click', function() {
    var dayIndex = $(this).closest('.day').index();
    $('#addEditWindow').show().data('dayIndex', dayIndex);
    $('#addEditForm')[0].reset();
});


// Modal cancel button
$('#formCancelButton').off('click').on('click', function() {
    $('#addEditWindow').hide();
});


$('#addEditForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        var dayIndex = $('#addEditWindow').data('dayIndex');
        var id = $('#formId').val().trim();
        var departureTime = $('#formDepartureTime').val().trim();
        var arrivalTime = $('#formArrivalTime').val().trim();
        var toc = $('#formTOC').val().trim();
        var travelClass = $('#formClass').val().trim();
        var from = $('#formFrom').val().trim();
        var to = $('#formTo').val().trim();
        var note = $('#formNote').val().trim();

        if (!/^\d{4}$/.test(departureTime) || !/^\d{4}$/.test(arrivalTime)) {
            alert("Times must be in 4-digit format (e.g., 0900).");
            return;
        }
        if (toc.length > 5 || travelClass.length > 5 || id.length > 10) {
            alert("TOC and Class max 5 chars, ID max 10 chars.");
            return;
        }

        var itineraryItem = {
            id: id,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            toc: toc,
            class: travelClass,
            from: from,
            to: to,
            note: note
        };

        if (!travelItinerary.days[dayIndex]) {
            travelItinerary.days[dayIndex] = [];
        }
        travelItinerary.days[dayIndex].push(itineraryItem);

        $('#addEditWindow').hide();
        sortJourneysByStartTime();
        updateUI();
    });


    }


    $("#nextButton").click(function(){
        
        travelItinerary.name = $("#nameField").val();
        travelItinerary.description = $("#descField").val();
        travelItinerary.startDate = $("#startDateField").val();
        travelItinerary.endDate = $("#endDateField").val();

        nextButton();
    });
    $("#backButton").click(function(){
        $("#planningScreen").hide();
        $("#startScreen").show();
    });

    $('#finishButton').click(function(){

        if (!confirm("Are you sure you want to finish planning?")) {
            return;
        }

        
        $("#printTitle").text(travelItinerary.name.toUpperCase() || "MY GENERATED TRIP");
        $("#printDescription").text((travelItinerary.description.toUpperCase() || "GENERATED " + new Date().toLocaleDateString()));
        $("#printDuration").text(travelItinerary.duration + " DAYS");
        $("#printFrom").text(travelItinerary.startDate.toUpperCase());
        $("#printTo").text(travelItinerary.endDate.toUpperCase());

        

        $("#tableSection table").remove();

        var table = $('<table>');
        table.append('<tr><th class="short">ID</th><th class="short">DEP</th><th class="short">ARR</th><th class="long">FROM</th><th class="long">TO</th><th class="short">TOC</th><th class="long">NOTE</th></tr>');
        var dayNumber = 1;
        travelItinerary.days.forEach(function(day) {
            
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
            
            row.append('<td class="note">' + itinerary.note + '</td>');
            table.append(row);
            });
        
            dayNumber++;
        });

        
        var spareRowTitle = $('<tr>').append('<td colspan="8">Spare Row</td>');
        table.append(spareRowTitle);

        
        for (var i = 0; i < 12; i++) {
            var emptyRow = $('<tr>');
            emptyRow.append('<td class="short space"></td>');
            emptyRow.append('<td class="short space"></td>');
            emptyRow.append('<td class="short space"></td>');
            emptyRow.append('<td class="long space"></td>');
            emptyRow.append('<td class="long space"></td>');
            emptyRow.append('<td class="short space"></td>');
            emptyRow.append('<td class="long space"></td>');
            table.append(emptyRow);
        }



        $('#tableSection').append(table);

        $("#planningScreen").hide();
        $("#finalScreen").show();

        
        localStorage.setItem('travelItinerary', JSON.stringify(travelItinerary));





        console.log(travelItinerary);
    });

    $('#backToPlanningButton').click(function(){
        $("#finalScreen").hide();
        $("#planningScreen").show();
    });

    $('#printButton').click(function(){
        document.title = travelItinerary.name || "My generated trip" + (travelItinerary.startDate ? " from " + travelItinerary.startDate : "") + (travelItinerary.endDate ? " to " + travelItinerary.endDate : "");
        $('#printNavigationButtons').addClass('hidden');
        
        
        setTimeout(function() {
            window.print();
            
            $('#printNavigationButtons').removeClass('hidden');
        }, 0);
    });

    $('#loadButton').click(function(){
        var data = prompt("Enter the JSON data:");
        try {
            travelItinerary = JSON.parse(data);
            localStorage.setItem('travelItinerary', JSON.stringify(travelItinerary));
            $("#nameField").val(travelItinerary.name);
            $("#descField").val(travelItinerary.description);
            $("#startDateField").val(travelItinerary.startDate);
            $("#endDateField").val(travelItinerary.endDate);


            
        } catch (e) {
            alert("Invalid JSON data.");
            return;
        }
        

        nextButton();
    });

    $('#saveToJson').click(function(){
        $('#saveToJson').text("Copied!")
        var jsonString = JSON.stringify(travelItinerary);
        navigator.clipboard.writeText(jsonString)
            .then(function() {
            $('#saveToJson').text("Copied!");
            })
            .catch(function(error) {
            console.error("Failed to copy JSON data to clipboard: ", error);
            });

        setTimeout(() => {
            $('#saveToJson').text("Copy as string");
        }, 5000);
   
    });

});
