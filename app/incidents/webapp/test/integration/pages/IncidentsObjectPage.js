sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.sap.teched.ca262.incidents',
            componentId: 'IncidentsObjectPage',
            contextPath: '/Incidents'
        },
        CustomPageDefinitions
    );
});