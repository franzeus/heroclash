var Group = function(name) {
  this.id = name;
  this.creatures = [];
  this.deadCreatures = 0;
  this.killedCreatures = 0;

  this.element = jQuery('#group_template').clone();
  this.element.removeClass('template');
  this.body = this.element.find('.group_body').first();
  this.message = this.element.find('.group_message').first();
  this.messageText = this.message.find('.message_text');
  this.messageLen = this.message.find('.message_length');
  this.totalMessageLen = 0;
};

Group.prototype.draw = function(groupWidth) {
  this.element.css({ width : groupWidth });
  this.body.html('<div>' + this.id + '</div>');
  for (var i = 0; i < this.creatures.length; i++) {
    var creature = this.creatures[i];
    this.body.append(creature.element);
  }
};

Group.prototype.isDead = function() {
  return this.deadCreatures >= this.creatures.length;
};

Group.prototype.attackedBy = function(creaturesGetKilled) {
  if (this.isDead()) {
    console.warn(this.id, ' can not be attacked - no creatures left!');
    return;
  }

  if (creaturesGetKilled !== 0) {
    this.remove(creaturesGetKilled);
    if (this.isDead()) {
      this.body.addClass('dead_group_body');
    }
  } else {
    console.log(this.id, 'did not lose any', creaturesGetKilled);
  }
};

Group.prototype.says = function(message) {
  console.log(this.id, message.text.length, message.text);
  var msgLen = message.text.length;
  this.totalMessageLen += msgLen;
  this.messageLen.html(msgLen);
  this.messageText.html(message.text);
};

Group.prototype.add = function(creature) {
  this.creatures.push(creature);
  creature.group = this;
  return this;
};

Group.prototype.killCreatures = function(number) {
  this.killedCreatures += number;
};

Group.prototype.setWinner = function(number) {
  this.body.addClass('winner_group_body');
};

Group.prototype.remove = function(number) {
  var numberOfLosses = this.deadCreatures + number;
  this.deadCreatures = Math.min(this.creatures.length, numberOfLosses);
  console.log(this.id, 'loses', number);

  if (number > 0) {
    var count = 0;
    for (var i = 0; i < this.creatures.length; i++) {
      var current = this.creatures[i];
      if (current.isDead) {
        continue;
      }
      current.setDead();
      count++;
      if (count >= number) {
        break;
      }
    }
  }

  return this;
};

