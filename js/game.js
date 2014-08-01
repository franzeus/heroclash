var Game = {
  // @var {Array} groups
  groups : [],
  // @var {Array} deadGroups
  deadGroups: [],
  // @var {Number} currentGroupIndex
  currentGroupIndex: 0,
  // @var {Number} rounds
  rounds: 0,
  // @const {Number} NEXT_ROUND_DELAY
  NEXT_ROUND_DELAY: 1000,
  //
  container: null,

  init : function() {
    this.container = document.getElementById('gameContainer');
  },

  addGroup : function(group) {
    if (!group) {
      throw 'YUNO give me group object?!';
    }
    this.groups.push(group);
    this.container.appendChild(group.element);
    return this;
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
    this.render();
    this.playRound();
  },

  gameOver : function(winnerGroup) {
    winnerGroup.setWinner();
    console.log("WINNER", winnerGroup.id, "Killed: " + winnerGroup.killedCreatures);
    console.log("Rounds", this.rounds);
  },

  render : function() {
    var groupWidth = (100 / this.groups.length) + '%';

    for (var i = 0; i < this.groups.length; i++) {
      this.groups[i].draw(groupWidth);
    }
  },

  /**
   * Let current group attack another group until there is only one group left
   */
  playRound : function() {
    var self = this;
    var attackingGroup = this.groups[this.currentGroupIndex];
    var groupToAttack = this.getGroupToAttack(attackingGroup);
    console.log('-----------------------');
    self.rounds++;
    console.log(attackingGroup.id, 'attacks', groupToAttack.id);
    var numberOfKillingCreatures = this.attackWillKillNumOfCreatures();
    groupToAttack.attackedBy(attackingGroup, numberOfKillingCreatures);
    attackingGroup.killCreatures(numberOfKillingCreatures);

    // Lets check if the attacked group can stand another attack, if not add it to the 
    // dead groups
    if (groupToAttack.isDead()) {
      this.addDeadGroup(groupToAttack);
    }
    this.render();

    // All groups (expect one) are dead
    if (this.deadGroups.length === this.groups.length - 1) {
      this.gameOver(attackingGroup);
    // Next round
    } else {
      setTimeout(function() {
        self.increaseGroupIndex.call(self);
        self.playRound.call(self);
      }, this.NEXT_ROUND_DELAY);
    }
  },

  /**
   * Returns a random group of the groups list, which will be attacked by current group
   * @param {Object} attackingGroup - The current group which attacks
   * @return {Object}
   */
  getGroupToAttack : function(attackingGroup) {
    var groupToAttack = null;
    do {
      groupToAttack = getRandomArrayItem(this.groups);
    } while (!(groupToAttack.id !== attackingGroup.id && !this.isGroupDead(groupToAttack)));
    return groupToAttack;
  },

  /**
  * @return {Number}
  */
  attackWillKillNumOfCreatures : function() {
    var creaturesToKill = getRandomInt(0, 1);
    //TODO: non deterministic code
    return creaturesToKill;
  },

  /**
  * Increases the current group index
  */
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

  /**
  * Adds a group to the dead groups list
  * @param {Object} group - The group to add
  */
  addDeadGroup : function(group) {
    if (this.isGroupDead(group)) {
      console.warn('This group is actually already dead', group.id);
      return;
    }
    console.log('Add dead group', group.id);
    this.deadGroups.push(group.id);
  },

  /**
   * Returns true of group can not attack or be attacked
   * @param {Object} group - The group to check
   * @return {Boolean}
   */
  isGroupDead : function(group) {
    return this.deadGroups.indexOf(group.id) > -1;
  },

  /**
   * Returns index of the groups list of a groupd by the group id property
   * @param {String} id - The group id
   * @return {Number|Null}
   */
  getGroupIndexById : function(id) {
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].id === id) {
        return i;
      }
    }
    return null;
  }

};