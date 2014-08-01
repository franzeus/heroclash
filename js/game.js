var Game = {

  groups : [],
  deadGroupsIndexes: [],
  currentGroupIndex: 0,
  rounds: 0,
  NEXT_ROUND_DELAY: 2000,

  addGroup : function(group) {
    if (!group) {
      throw 'YUNO give me group object?!';
    }
    this.groups.push(group);
  },

  start : function() {
    var numberOfGroups = this.groups.length;
    if (numberOfGroups <= 1) {
      throw 'Well it seems there will be no war today!';
    }
    console.log('Let the games begin!');
    // Randomly select first attacker
    this.currentGroupIndex = getRandomInt(0, numberOfGroups - 1);
    this.playRound();
  },

  playRound : function() {
    var self = this;
    var attackingGroup = this.groups[this.currentGroupIndex];
    var groupToAttack = this.getGroupToAttack(attackingGroup);

    groupToAttack.attackedBy(attackingGroup, this.attackWillKillNumOfCreatures());

    // Lets check if the attacked group can stand another attack, if not add it to the dead groups
    if (!groupToAttack.canBeAttacked()) {
      var groupIndex = this.getGroupIndexById(groupToAttack);
      this.deadGroupsIndexes.push(groupIndex);
    }

    // All groups (expect one) are dead
    if (this.deadGroupsIndexes.length === this.groups.length - 1) {
      console.log("WINNER", attackingGroup.id);
    // Next round
    } else {
      setTimeout(function() {
        self.rounds++;
        self.increaseGroupIndex.call(self);
        self.playRound.call(self);
      }, this.NEXT_ROUND_DELAY);
    }
  },

  // Lets get a random group to attack, but not the currently attacking group
  // Todo: would actually be funny :D
  getGroupToAttack : function(attackingGroup) {
    var groupToAttack = null;
    do {
      groupToAttack = getRandomArrayItem(this.groups);
    } while (groupToAttack.id === attackingGroup.id &&
             groupToAttack.canBeAttacked());
    return groupToAttack;
  },

  attackWillKillNumOfCreatures : function() {
    //TODO: non deterministic code
    return getRandomInt(0, 3);
  },

  increaseGroupIndex : function() {
    var newIndex = this.currentGroupIndex + 1;
    if (newIndex >= this.groups.length) {
      newIndex = 0;
    }
    this.currentGroupIndex = newIndex;
  },

  getGroupIndexById : function(id) {
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].id === id) {
        return i;
      }
    }
    return i;
  }


};