groceries = new Mongo.Collection("groceries");

if (Meteor.isClient) {
    Session.setDefault("splits", [{name: "Person 1", split: 0}, {name: "Person 2", split: 0},{name: "Person 3", split: 0}]);
    Session.setDefault("items", [{}]);
    Template.split.helpers({
        splits: function() {
            return Session.get("splits");
        }
    });
    
    Template.body.events({
        "submit .new-item": function (event) {
            var count = $('input[type="checkbox"]:checked').length;
            var itr = 0;
            var price = event.target.price.value;
            var splits = Session.get("splits");
            var items = Session.get("items");
            items.push(event.target.item.value);
            $(":checkbox").each(function() {
                if($(this).is(':checked')) {
                    div = (price/count).toFixed(2);
                    console.log( parseFloat(div));
                    splits[itr]["split"] += parseFloat(div);
                }
                itr++;
            });
            Session.set("splits", splits);
            Session.set("items", items);
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
    
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

}