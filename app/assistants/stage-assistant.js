function StageAssistant() {
	/* this is the creator function for your stage assistant object */
};

StageAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the stage is first created */
	if (this.controller.setWindowOrientation) {
		this.controller.setWindowOrientation("free");
	}
	this.controller.pushScene("first");
};

StageAssistant.prototype.handleCommand = function(inEvent) {
	switch (inEvent.type) {
//		case Mojo.Event.commandEnable:
//			switch (inEvent.command) {
//				case Mojo.Menu.prefsCmd:
//					inEvent.stopPropagation();
//				break;
//			}
//		break;
		
		case Mojo.Event.command:
			switch (inEvent.command) {
				case "aboutTubeStatus-TAP":
					this.controller.activeScene().showAlertDialog({
						onChoose : function(inValue) {},
						title : "Tube Status",
						message : "Shows current status of London tube and DLR lines. This application uses the tube updates API provided by http://tubeupdates.com/",
						choices : [
							{ label : "Ok", value : ""}
							]
					});
				break;
				case Mojo.Menuj.prefsCmd:
					//
				break;
			}
		break;
	}
};