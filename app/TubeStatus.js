/*
	Tube Status
	Copyright (C) 2010 Andrew Savory
*/
	
function TubeStatus() {

	// global vars
	this.appMenuAttributes = {
		omitDefaultItems : true,
		richTextEditMenu : false
	};

	this.appMenuModel = {
		visible : true,
		items : [
//			{ label : "Preferences", command : "preferences-TAP"},
			{ label : "About Tube Status", command : "aboutTubeStatus-TAP"}
		]
	};

	// storage
	
	// connectivity
	this.checkConnectivity = function(inAssistant, inSuccessCallback, inFailureCallback) {
		inAssistant.controller.serviceRequest("palm://com.palm.connectionmanager", {
			method: "getstatus",
			parameters : { subscribe: false},
			onSuccess : function(inResponse) {
				if (inResponse.isInternetConnectionAvailable) {
					inSuccessCallback();
				} else {
					inAssistant.controller.showAlertDialog({
						onChoose : function() { inFailureCallback() },
						title : "Error",
						message : "Internet connection not available",
						choices : [ { label : "Ok", value : "ok" } ]
					});
				}
			},
			onFailure : function() {
				inAssistant.controller.showAlertDialog({
					onChoose : function() { inFailureCallback() },
					title : "Error",
					message : "Internet connection status not available",
					choices : [ { label : "Ok", value : "ok" } ]
				});
			}
		});
	};
}

var tubeStatus = new TubeStatus();