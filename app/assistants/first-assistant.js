function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
};

FirstAssistant.prototype.TubeListModel = { items : [ ] };

FirstAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */

	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	this.controller.setupWidget(Mojo.Menu.appMenu, tubeStatus.appMenuAttributes, tubeStatus.appMenuModel);
	this.controller.setupWidget("tubeLines_divSpinner", { spinnerSize : "large"}, {spinning : true});
	
	this.controller.setupWidget("tubeLines", {
		swipeToDelete : false,
		itemTemplate : "first/list",
		emptyTemplate : "first/list-empty",
		}, this.TubeListModel);

	/* add event handlers to listen to events from widgets */
	//Mojo.Log.info("########## setup()");
};

FirstAssistant.prototype.activate = function() {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	//Mojo.Log.info("########## Activate");

	$("tubeLines_divScrim").show();
	this.TubeListModel.items = [ ];
	this.controller.modelChanged(this.TubeListModel, this);

	tubeStatus.checkConnectivity(this,
		function() {
			new Ajax.Request(
				"http://api.tubeupdates.com/?method=get.status&lines=all&format=json", {
					method : "get",
					requestHeaders : {Accept: 'application/json'},
					parameters : { method : "get.status", lines : "all", format : "json"},
					evalJSON : "force",
					onSuccess : this.processResults.bind(this),
					onFailure : function(inTransport) {
						$("tubeLines_divScrim").hide();
						Mojo.Controller.errorDialog("FAILURE: " + inTransport.status + " - " + inTransport.responseText);
					},
					onException : function(inTransport, inException) {
						$("tubeLines_divScrim").hide();
						Mojo.Controller.errorDialog("EXCEPTION: " + inException);
					}
				}
			);
		}.bind(this),
		function() {
			this.controller.stageController.popScene();
		}.bind(this)
	);
};

FirstAssistant.prototype.processResults = function(inTransport) {
	
	if (inTransport.responseJSON == null) {
		this.controller.showAlertDialog({
			onChoose : function(inValue) {
				this.controller.stageController.popScene();
			},
			title : "JSON response NULL",
			message : "The server did not return a response, or could not be contacted",
			choices : [
				{ label : "Ok", type : "affirmative" }
			]
		});
		return;
	}

	var data = [];
	inTransport.responseJSON.response.lines.each(function(item) {
		// FIXME find a way to push directly onto this.TubeListModel.items (getting this scope correct)
		data.push(item);
	});
	for (var i = 0; i < data.length; i++) {
		if (data[i].status == "good service") {
			data[i].image = "images/yes.png";
		} else {
			data[i].image = "images/no.png";
		}
		if (data[i].messages.length > 0) {
			data[i].message = "";
			for (var j = 0; j < data[i].messages.length; j++) {
				data[i].message += data[i].messages[j] + "<br />";
			}
		}
		this.TubeListModel.items.push(data[i]);
	}

	this.controller.modelChanged(this.TubeListModel, this);

	$("tubeLines_divScrim").hide();
}

FirstAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FirstAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
