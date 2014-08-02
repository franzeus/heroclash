(function() {
  Game.init();
  // Add groups and its creatures
  var addGroups = function() {
    var groups = [
      {
        id: 'A',
        creatures: 5
      },
      {
        id: 'B',
        creatures: 5
      }
    ];
    for (var i = 0; i < groups.length; i++) {
      var group = new Group(groups[i].id);
      for (var k = 0; k < groups[i].creatures; k++) {
        var creature = new Creature();
        group.add(creature);
      }
      Game.addGroup(group);
    }
  }();

  Game.start();
})();