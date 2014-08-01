var Game = {

  groups : [],
  deadGroups: [],
  currentGroupIndex: 0,
  rounds: 0,
  NEXT_ROUND_DELAY: 100,

  addGroup : function(group) {
    if (!group) {
      throw 'YUNO give me group object?!';
    }
    this.groups.push(group);
  },

  start : function() {
    this.deadGroups = [];
    var numberOfGroups = this.groups.length;
    if (numberOfGroups <= 1) {
      throw 'Well it seems there will be no war today!';
    }
    console.log('Let the games begin!');
    // Randomly select first attacker
    this.currentGroupIndex = getRandomInt(0, numberOfGroups - 1);
    this.playRound();
  },

  gameOver : function(winnerGroup) {
    console.log("WINNER", winnerGroup.id);
  },

  playRound : function() {
    var self = this;
    var attackingGroup = this.groups[this.currentGroupIndex];
    var groupToAttack = this.getGroupToAttack(attackingGroup);
    console.log('-----------------------');
    console.log(attackingGroup.id, 'attacks', groupToAttack.id);
    groupToAttack.attackedBy(attackingGroup, this.attackWillKillNumOfCreatures());

    // Lets check if the attacked group can stand another attack, if not add it to the 
    // dead groups
    if (groupToAttack.isDead()) {
      this.addDeadGroup(groupToAttack);
    }

    // All groups (expect one) are dead
    if (this.deadGroups.length === this.groups.length - 1) {
      this.gameOver(attackingGroup);
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
    } while (!(groupToAttack.id !== attackingGroup.id && !this.isGroupDead(groupToAttack)));
    return groupToAttack;
  },

  attackWillKillNumOfCreatures : function() {
    var creaturesToKill = getRandomInt(0, 1);
    //TODO: non deterministic code
    return creaturesToKill;
  },

  increaseGroupIndex : function() {
    var newIndex = this.currentGroupIndex + 1;
    if (newIndex >= this.groups.length) {
      newIndex = 0;
    }
    this.currentGroupIndex = newIndex;

    // Only chose a group that is not dead
    if (this.isGroupDead(this.groups[this.currentGroupIndex])) {
      this.increaseGroupIndex();
    }
  },

  addDeadGroup : function(group) {
    if (this.isGroupDead(group)) {
      console.warn('This group is actually already dead', group.id);
      return;
    }
    console.log('Add dead group', group.id);
    this.deadGroups.push(group.id);
  },

  isGroupDead : function(group) {
    return this.deadGroups.indexOf(group.id) > -1;
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