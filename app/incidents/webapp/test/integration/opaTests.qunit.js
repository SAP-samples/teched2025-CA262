sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/sap/teched/ca262/incidents/test/integration/FirstJourney',
		'com/sap/teched/ca262/incidents/test/integration/pages/IncidentsList',
		'com/sap/teched/ca262/incidents/test/integration/pages/IncidentsObjectPage'
    ],
    function(JourneyRunner, opaJourney, IncidentsList, IncidentsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/sap/teched/ca262/incidents') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheIncidentsList: IncidentsList,
					onTheIncidentsObjectPage: IncidentsObjectPage
                }
            },
            opaJourney.run
        );
    }
);