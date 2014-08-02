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
  NEXT_ROUND_DELAY: 2000,
  // @var {Element}
  container: null,
  // @var {Element}
  roundState: null,
  // @var {Array}
  twitterTags: [],

  init : function(twitterTags) {
    this.twitterTags = twitterTags;
    this.container = jQuery('#gameContainer');
    this.roundState = jQuery('#round_state');
  },

  addGroup : function(group) {
    if (!group) {
      throw 'YUNO give me group object?!';
    }
    this.groups.push(group);
    this.container.append(group.element);
    return this;
  },

  reset : function() {
    this.deadGroups = [];
    this.rounds = 0;
    this.roundState.html('').addClass('hide');
    return this;
  },

  start : function() {
    this.reset();
    var numberOfGroups = this.groups.length;
    if (numberOfGroups <= 1) {
      throw 'Well it seems there will be no war today!';
    }
    console.log('Let the games begin!');
    // Randomly select first attacker
    this.currentGroupIndex = getRandomInt(0, numberOfGroups - 1);
    this.roundState.removeClass('hide');
    this.render();
    this.playRound();
  },

  gameOver : function(winnerGroup) {
    winnerGroup.setWinner();
    console.log("WINNER", winnerGroup.id);
    console.log("Rounds", this.rounds);
    this.roundState.html(winnerGroup.id + ' is the WINNER! (' + winnerGroup.totalMessageLen + ')');
  },

  render : function() {
    var groupWidth = (100 / this.groups.length) + '%';
    for (var i = 0; i < this.groups.length; i++) {
      this.groups[i].draw(groupWidth);
    }
  },

  /**
   * Lets current group attack another group until there is only one group left
   */
  playRound : function() {
    var attackingGroup = this.groups[this.currentGroupIndex];
    var groupToAttack = this.getGroupToAttack(attackingGroup);
    console.log('-----------------------');
    this.rounds++;
    console.log(attackingGroup.id, 'attacks', groupToAttack.id);

    this.attack(attackingGroup, groupToAttack, this.evaluateRound.bind(this));
  },

  /**
   * Triggered after each round has ended
   * @param {Object} attackingGroup
   * @param {Object} groupToAttack
   */
  evaluateRound : function(attackingGroup, groupToAttack, winnerGroup) {
    var self = this;

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
   * Attacker attacks defender, either one of them loses creatures or none of them
   * @param {Object} attacker
   * @param {Object} defender
   */
  attack : function(attacker, defender, callback) {
    var creaturesToKill = 0;
    var self = this;
    this.roundState.html('LOADING SPELLS ...');
    this.requestRandomTweet(function(attackerTweet, defenderTweet) {
      var attackerTweetLen = attackerTweet.text.length;
      var defenderTweetLen = defenderTweet.text.length;
      var winnerGroup = null;
      var action = ' ATTACKS SUCCESSFULLY';

      attacker.says(attackerTweet);
      defender.says(defenderTweet);

      if (attackerTweetLen > defenderTweetLen) {
        defender.attackedBy(1);
        winnerGroup = attacker;
      } else if (attackerTweetLen < defenderTweetLen) {
        attacker.attackedBy(1);
        winnerGroup = defender;
        action = ' DEFENDS SUCCESSFULLY';
      }

      var winnerName = winnerGroup ? winnerGroup.id + action : 'A DRAW';
      self.roundState.html(winnerName);

      callback(attacker, defender, winnerGroup);
    });
  },

  /**
   * Request node server to get twitter tweets :D
   * @param {Function} callback
   */
  requestRandomTweet : function(callback) {
    var tags = [getRandomArrayItem(this.twitterTags)];
    jQuery.ajax({
      type: "GET",
      url: "/api",
      data: { tags: tags }
    }).done(function(response) {
      if (typeof callback === 'function') {
        // One random tweet for attacker, the other for the defender
        callback(getRandomArrayItem(response.statuses),
                 getRandomArrayItem(response.statuses));
      }
    });
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