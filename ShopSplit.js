groceries = new Mongo.Collection("groceries");

if (Meteor.isClient) {
    var split = [0,0,0];
    Session.setDefault("split", split);
    Template.split.helpers({
        split: function() {
            return Session.get("split");
        }
    })
    Template.body.helpers({
        groceries: function () {
            if (Session.get("hideCompleted")) {
                return groceries.find({checked:{$ne: true}}, {sort: {createdAt: -1}});
            }
            else {
                return groceries.find({}, {sort: {createdAt: -1}});
            }
        },
        hideCompleted: function () {
            return Session.get("hideCompleted");
        },
        incompleteCount: function () {
            return groceries.find({checked: {$ne:true}}).count();
        }
    });
    
    Template.body.events({
        "submit .new-item": function (event) {
            var count = $('input[type="checkbox"]:checked').length;
            var itr = 0;
            var price = event.target.price.value;
            $(":checkbox").each(function() {
                if($(this).is(':checked')) {
                    split[itr] += price / count;
                }
                itr++;
            });
            Session.set("split", split);
            
            //Meteor.call("addTask", event.target);
            
            //Clear 
            event.target.item.value = "";
            event.target.price.value = "";
            $(":checkbox").each( function() {
                $(this).prop("checked", false);
            });
            
            return false;
        },
        "change .hide-completed input": function(event) {
            Session.set("hideCompleted", event.target.checked);
        },
       
    });
    
    Template.task.events({
        "click .toggle-checked": function() {
            Meteor.call("setChecked", this._id, !this.checked);
        },
        "click .delete": function() {
            Meteor.call("deleteTask", this._id);
        }
    });
    
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

} 

Meteor.methods({
    addTask: function (text) {
        if( ! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        
        groceries.insert({
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    deleteTask: function (taskId) {
        groceries.remove(taskId);
    },
    setChecked: function (taskId, setChecked) {
        groceries.update(taskId, {$set: {checked: setChecked}});
    }
});